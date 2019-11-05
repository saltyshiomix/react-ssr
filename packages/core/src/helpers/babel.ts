import { existsSync } from 'fs';
import {
  join,
  resolve,
} from 'path';

const cwd: string = process.cwd();

export const hasUserBabelrc = (): boolean => {
  return existsSync(join(cwd, '.babelrc')) || existsSync(join(cwd, '.babelrc.js')) || existsSync(join(cwd, 'babel.config.js'));
};

export const getBabelrc = (): string => {
  if (existsSync(join(cwd, '.babelrc'))) return join(cwd, '.babelrc');
  if (existsSync(join(cwd, '.babelrc.js'))) return join(cwd, '.babelrc.js');
  if (existsSync(join(cwd, 'babel.config.js'))) return join(cwd, 'babel.config.js');
  return resolve(__dirname, '../lib/babel.js');
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

export const getBabelConfig = () => {
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
