import { existsSync } from 'fs';
import { resolve } from 'path';

const cwd: string = process.cwd();

export const getEngine = (): 'jsx' | 'tsx' => existsSync(resolve(cwd, 'tsconfig.json')) ? 'tsx' : 'jsx';

export const hasUserBabelrc = (): boolean => {
  return existsSync(resolve(cwd, '.babelrc')) || existsSync(resolve(cwd, '.babelrc.js')) || existsSync(resolve(cwd, 'babel.config.js'));
};

export const getBabelrc = (): string => {
  if (existsSync(resolve(cwd, '.babelrc'))) return resolve(cwd, '.babelrc');
  if (existsSync(resolve(cwd, '.babelrc.js'))) return resolve(cwd, '.babelrc.js');
  if (existsSync(resolve(cwd, 'babel.config.js'))) return resolve(cwd, 'babel.config.js');
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

export const gracefullyShutDown = (fn: () => void) => {
  let run = false;
  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };
  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};
