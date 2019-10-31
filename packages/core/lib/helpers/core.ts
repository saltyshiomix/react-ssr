import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import readdir from 'recursive-readdir';

const cwd: string = process.cwd();

export interface Config {
  viewsDir: string;
  distDir: string;
  webpack?: (defaultConfig: webpack.Configuration, env: 'development' | 'production') => webpack.Configuration;
}

export const getSsrConfig = (): Config => {
  const defaultConfig = {
    viewsDir: 'views',
    distDir: '.ssr',
  };
  const ssrConfigPath = path.join(cwd, 'ssr.config.js');
  if (fs.existsSync(ssrConfigPath)) {
    return Object.assign(defaultConfig, require(ssrConfigPath));
  } else {
    return defaultConfig;
  }
};

export const getEngine = (): 'jsx' | 'tsx' => fs.existsSync(path.join(cwd, 'tsconfig.json')) ? 'tsx' : 'jsx';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

const config: Config = getSsrConfig();

export const getPages = async (): Promise<string[]> => {
  return readdir(path.join(cwd, config.viewsDir));
};

export const getPageId = (page: string, separator: string = '_'): string => {
  const [, ...rest] = page.replace(path.join(cwd, config.viewsDir), '')
                          .replace(path.extname(page), '')
                          .split(path.sep);
  return rest.join(separator);
};

export const readFileWithProps = (file: string, props: any) => {
  return fs.readFileSync(file).toString().replace('__REACT_SSR_PROPS__', JSON.stringify(props).replace(/"/g, '\\"'));
};
