import {
  existsSync,
  readFileSync,
  readdirSync,
  lstatSync,
  Stats,
} from 'fs';
import {
  join,
  resolve,
  sep,
  basename,
  extname,
  dirname,
  isAbsolute,
} from 'path';
import readdir from 'recursive-readdir';
import Config from './config';

const cwd: string = process.cwd();

export const getEngine = (): 'jsx' | 'tsx' => existsSync(join(cwd, 'tsconfig.json')) ? 'tsx' : 'jsx';

export const hasUserBabelrc = (): boolean => {
  return existsSync(join(cwd, '.babelrc')) || existsSync(join(cwd, '.babelrc.js')) || existsSync(join(cwd, 'babel.config.js'));
};

export const getBabelrc = (): string => {
  if (existsSync(join(cwd, '.babelrc'))) return join(cwd, '.babelrc');
  if (existsSync(join(cwd, '.babelrc.js'))) return join(cwd, '.babelrc.js');
  if (existsSync(join(cwd, 'babel.config.js'))) return join(cwd, 'babel.config.js');
  return resolve(__dirname, '../babel.config.default.js');
};

export const getBabelRule = () => {
  return {
    test: /\.(js|ts)x?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        extends: getBabelrc(),
      },
    },
  };
};

export const gracefullyShutDown = async (getPort: () => number) => {
  let run = false;
  const wrapper = () => {
    if (!run) {
      run = true;
      const resolve = require('resolve-as-bin');
      const spawn = require('cross-spawn');
      const port = getPort();
      spawn.sync(resolve('fkill'), ['-f', `:${port}`], {
        cwd,
        stdio: 'inherit',
      });
    }
  };
  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};

const ignores = [
  '.*',
  '*.json',
  '*.lock',
  '*.md',
  '*.txt',
  '*.yml',
  'LICENSE',
];

const ignoreDotDir = (file: string, stats: Stats) => {
  return stats.isDirectory() && basename(file).startsWith('.');
};

const ignoreNodeModules = (file: string, stats: Stats) => {
  return stats.isDirectory() && basename(file) == 'node_modules';
};

export const getPages = async (config: Config): Promise<string[][]> => {
  const allPages = await readdir(cwd, [ignoreNodeModules, ignoreDotDir, ...ignores]);
  const entryPages = await readdir(join(cwd, config.viewsDir), [ignoreDotDir, ...ignores]);
  const otherPages = [];
  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i];
    if (entryPages.includes(p)) {
      continue;
    }
    otherPages.push(p);
  }
  return [entryPages, otherPages];
};

export const getPageId = (page: string, config: Config, separator: string = '_'): string => {
  const [, ...rest] = page.replace(join(cwd, config.viewsDir), '')
                          .replace(extname(page), '')
                          .split(sep);
  return rest.join(separator);
};

export const readFileWithProps = (file: string, props: any) => {
  return readFileSync(file).toString().replace('__REACT_SSR_PROPS__', JSON.stringify(props).replace(/"/g, '\\"'));
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBabelPresetsAndPlugins = () => {
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ];
  const plugins = [
    'babel-plugin-react-require',
    'babel-plugin-css-modules-transform',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true,
    }],
    ['@babel/plugin-transform-runtime', {
      corejs: 2,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
  ];
  return { presets, plugins };
};

const Module = require('module');
const Terser = require('terser');
const escaperegexp = require('lodash.escaperegexp');

let cacheIndex = 0;
let cacheDepth = 0;
let cacheMap = new Map<number, [string, string]>();
let _cacheMap = new Map<string, string>();

const resolveAsSerializedExports = (transformed: string, absolutePath: string): string => {
  const Matches = transformed.match(/__(\d*?)__/gm);
  const quote = '\`'.repeat(cacheDepth + 1);
  if (Matches) {
    const values = Array.from(Matches.values());
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const index = parseInt(value.replace(/__/g, ''), 10);
      let [_absolutePath, _transformed] = cacheMap.get(index) as [string, string];
      if (_cacheMap.has(_absolutePath)) {
        transformed = transformed.replace(`__${index}__`, `JSON.parse(${quote + _cacheMap.get(_absolutePath) + quote})`);
      } else {
        transformed = transformed.replace(`__${index}__`, `JSON.parse(${quote + resolveAsSerializedExports(_transformed, _absolutePath) + quote})`);
      }
    }
    cacheDepth++;
    return resolveAsSerializedExports(transformed, absolutePath);
  } else {
    const serializedExports = JSON.stringify(requireFromString(transformed, absolutePath));
    _cacheMap.set(absolutePath, serializedExports);
    cacheDepth++;
    return serializedExports;
  }
};

export const babelRequire = (filename: string) => {
  let code = babelTransform(filename, filename, /* initial */ true);

  const keys = Array.from(cacheMap.keys());
  for (let i = 0; i < keys.length; i++) {
    const [absolutePath, transformed] = cacheMap.get(keys[i]) as [string, string];
    if (_cacheMap.has(absolutePath)) {
      code = code.replace(`__${i}__`, `JSON.parse(\`${_cacheMap.get(absolutePath)}\`)`);
    } else {
      cacheDepth = 1;
      const serializedExports = resolveAsSerializedExports(transformed, absolutePath);
      code = code.replace(`__${i}__`, `JSON.parse(\`${serializedExports}\`)`);
    }
  }

  console.log(_cacheMap);

  cacheIndex = 0;
  // cacheDepth = 0;
  cacheMap = new Map<number, [string, string]>();
  _cacheMap = new Map<string, string>();

  console.log('=====');
  console.log('');
  console.log(code);
  console.log('');
  console.log('=====');

  return requireFromString(code, filename);
};

const requireFromString = (code: string, filename?: string) => {
  const f = filename || '';
  const p = module.parent;
  const m = new Module(f, p);
  m.filename = f;
  m.paths = Module._nodeModulePaths(dirname(f));
  m._compile(code, f);
  const _exports = m.exports;
  p && p.children && p.children.splice(p.children.indexOf(m), 1);
  return _exports;
}

const performBabelTransform = (filename: string): string => {
  const { code } = require('@babel/core').transform(readFileSync(filename).toString(), {
    filename,
    ...(getBabelPresetsAndPlugins()),
  });
  return Terser.minify(code).code;
}

const babelTransform = (filenameOrCode: string, parentFile: string, initial: boolean = false): string => {
  if (isAbsolute(filenameOrCode) && existsSync(filenameOrCode)) {
    if (initial) {
      const code = performBabelTransform(filenameOrCode);
      return babelTransform(code, parentFile);
    } else {
      return babelTransform(performBabelTransform(filenameOrCode), parentFile);
    }
  } else {
    const Matches: RegExpMatchArray | null = filenameOrCode.match(/require\([\"\']\.(.+?)[\"\']\)/gm);
    if (Matches) {
      for (const value of Array.from(Matches.values())) {
        const relativePath = value.match(/[\"\']\..+[\"\']/)![0].replace(/"/g, '');
        let absolutePath = resolve(dirname(parentFile), relativePath);
        if (lstatSync(absolutePath).isDirectory()) {
          const possibles = ['index.js', 'index.jsx', 'index.ts', 'index.tsx'];
          const files = readdirSync(absolutePath);
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (possibles.includes(file)) {
              absolutePath = join(absolutePath, file);
            }
          }
        }
        const transformed = babelTransform(absolutePath, absolutePath);
        cacheMap.set(cacheIndex, [absolutePath, transformed]);
        filenameOrCode = filenameOrCode.replace(new RegExp(escaperegexp(value)), `__${cacheIndex}__`);
        cacheIndex++;
      }
      return babelTransform(filenameOrCode, parentFile);
    } else {
      if (isAbsolute(filenameOrCode)) {
        return babelTransform(performBabelTransform(filenameOrCode), parentFile);
      }
      // console.log('finished');
    }

    return filenameOrCode;
  }
}
