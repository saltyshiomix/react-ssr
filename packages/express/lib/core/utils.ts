import {
  existsSync,
  readFileSync,
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

const getBabelPresetsAndPlugins = () => {
  const presets = [
    require('@babel/preset-env'),
    require('@babel/preset-react'),
    require('@babel/preset-typescript'),
  ];
  const plugins = [
    require('babel-plugin-react-require'),
    require('babel-plugin-css-modules-transform'),
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-proposal-class-properties'),
    [require('@babel/plugin-proposal-object-rest-spread'), {
      useBuiltIns: true,
    }],
    [require('@babel/plugin-transform-runtime'), {
      corejs: 2,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
  ];
  return { presets, plugins };
};

const Module = require('module');

// console.log(Module.builtinModules);

const requireResolve = (filename: string): string | undefined => {
  let resolved: string | undefined = undefined;
  try {
    resolved = require.resolve(filename);
  } catch (ignore) {}
  return resolved;
};

const isInNodePath = (p?: string): boolean => {
  if (!p) return false;
  return Module.globalPaths
    .map((nodePath: string) => resolve(process.cwd(), nodePath) + sep)
    .some((fullNodePath: string) => p.indexOf(fullNodePath) === 0);
}

const isModuleNotFoundError = (e: any) => e.code && e.code === 'MODULE_NOT_FOUND';

const getFilePath = (path: string, calledFrom: string): string => {
  const resolved: string | undefined = requireResolve(path);
  const isLocalModule = /^\.{1,2}[/\\]?/.test(path);
  const isSystemModule = resolved === path;
  const isInNode = isInNodePath(resolved);
  const isInNodeModule = !isLocalModule && /[/\\]node_modules[/\\]/.test(resolved || '');

  if (isSystemModule || isInNode || isInNodeModule) {
    return resolved as string;
  }

  if (!isLocalModule) {
    return path;
  }

  const localModuleName = join(dirname(calledFrom), path);
  try {
    return Module._resolveFilename(localModuleName);
  } catch (e) {
    if (isModuleNotFoundError(e)) {
      return localModuleName
    } else {
      throw e;
    }
  }
}

const escaperegexp = require('lodash.escaperegexp');

// let injecting = false;
// let workingParentFile: string | undefined = undefined;

export const babelRequire = (filename: string) => {
  return requireFromString(babelTransform(filename, filename), filename);
  // workingParentFile = filename;
  // try {
  //   return requireFromString(babelTransform(filename, filename), filename);
  // } finally {
  //   workingParentFile = undefined;
  // }
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

const babelTransform = (filenameOrCode: string, parentFile: string, initial: boolean = false): string => {
  if (existsSync(filenameOrCode)) {
    if (initial) {
      initial = false;
      // injecting = true;
      // workingParentFile = filenameOrCode;
      const { code } = require('@babel/core').transform(readFileSync(filenameOrCode).toString(), {
        filename: filenameOrCode,
        ...(getBabelPresetsAndPlugins()),
      });
      return `
function requireFromString(code, filename) {
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
${babelTransform(code, parentFile)}
`;
    } else {
      // workingParentFile = injecting ? filenameOrCode : workingParentFile;
      const { code } = require('@babel/core').transform(readFileSync(filenameOrCode).toString(), {
        filename: filenameOrCode,
        ...(getBabelPresetsAndPlugins()),
      });
      return babelTransform(code, parentFile);
    }
  } else {
    const Matches: RegExpMatchArray | null = filenameOrCode.match(/require\([\"\']\..+[\"\']\)/gm);
    if (Matches) {
      for (const value of Array.from(Matches.values())) {
        const relativePath = value.match(/[\"\']\..+[\"\']/)![0].replace(/"/g, '');
        let absolutePath = resolve(dirname(parentFile), relativePath);
        if (lstatSync(absolutePath).isDirectory()) {
          absolutePath = join(absolutePath, 'index.js');
        }

        // const depth: number = Array.from(value.match(/\.+\//)!.values())[0].replace('/', '').length - 1;
        // console.log(depth);
        // if (depth !== 0) {
        //   workingParentFile = absolutePath;
        // }


        // console.log(absolutePath);

        const transformed = `requireFromString(\`${babelTransform(absolutePath, absolutePath)}\`, '${absolutePath}')`;
        filenameOrCode = filenameOrCode.replace(new RegExp(escaperegexp(value)), transformed);
      }

      console.log(filenameOrCode);

      return babelTransform(filenameOrCode, parentFile);
    } else {
      console.log('finished');
    }

    if (isAbsolute(filenameOrCode)) {
      return babelTransform(filenameOrCode, parentFile);
    }

    return filenameOrCode;
  }
}



// const performBabelRequire = (filename: string) => {
//   workingParentFile = filename;
//   return requireFromString(babelTransform(filename), filename);
// };



const isUserDefined = (file: string): boolean => {
  return !(/node_modules/.test(file) || /package\.json/.test(file));
};

// const originalLoader = Module._load;

// Module._load = function(request: string, parent: NodeModule) {
//   if (!parent) return originalLoader.apply(this, arguments);

//   // console.log(toRealPath(request));

//   const file = getFilePath(request, parent.filename);
//   if (isAbsolute(file) && isUserDefined(file)) {
//     try {
//       return babelRequire(file);
//     } catch (ignore) {}
//   }
//   // if (workingParentFile) {
//   //   if (isUserDefined(file)) {
//   //     if (isAbsolute(file)) {
//   //       console.log('absolute: ' + file);
//   //       try {
//   //         return performBabelRequire(file);
//   //       } catch (ignore) {}
//   //     } else {
//   //       const resolved: string | undefined = requireResolve(file);
//   //       if (resolved) {
//   //         console.log('resolved: ' + resolved);
//   //         return originalLoader.apply(this, arguments);
//   //       } else {
//   //         console.log('raw file: ' + file);
//   //         console.log('workingParentFile: ' + workingParentFile);
//   //         console.log('resolve(dirname(workingParentFile), file): ' + resolve(dirname(workingParentFile), file));
//   //         try {
//   //           return performBabelRequire(resolve(dirname(workingParentFile), file));
//   //         } catch (ignore) {}
//   //       }
//   //     }
//   //   }
//   // } else {
//   //   if (isAbsolute(file) && isUserDefined(file)) {
//   //     try {
//   //       return babelRequire(file);
//   //     } catch (ignore) {}
//   //   }
//   // }

//   return originalLoader.apply(this, arguments);
// };
