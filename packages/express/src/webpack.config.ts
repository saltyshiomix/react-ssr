import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { Configuration } from 'webpack';
import babelrc from './babelrc';

const cwd: string = process.cwd();
const isProd: boolean = process.env.NODE_ENV === 'production';

const babelRule = {
  test: /\.(js|ts)x?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {},
  },
};

const hasUserBabelrc: boolean = existsSync(resolve(cwd, '.babelrc')) || existsSync(resolve(cwd, '.babelrc.js')) || existsSync(resolve(cwd, 'babel.config.js'));
if (hasUserBabelrc) {
  !isProd && console.log(chalk`{cyan [react-ssr]} Babelrc in: ${babelrc()}`);
}

babelRule.use.options = {
  cacheDirectory: true,
  extends: babelrc(),
};

export default (name: string, ext: '.jsx'|'.tsx', distDir: string): Configuration => {
  return {
    mode: isProd ? 'production' : 'development',
    context: cwd,
    entry: {
      [name]: `./react-ssr-src/entry${ext}`,
    },
    output: {
      path: resolve(cwd, distDir),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        babelRule,
      ],
    },
  };
};
