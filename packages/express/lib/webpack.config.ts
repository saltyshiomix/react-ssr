import { resolve } from 'path';
import chalk from 'chalk';
import { Configuration } from 'webpack';
import {
  hasUserBabelrc,
  getBabelrc,
  getBabelRule,
} from './utils';

const isProd: boolean = process.env.NODE_ENV === 'production';

export default (name: string, ext: '.jsx'|'.tsx', distDir: string, env: 'development' | 'production'): Configuration => {
  if (hasUserBabelrc()) {
    !isProd && console.log(chalk`{cyan [react-ssr]} Babelrc in: ${getBabelrc()}`);
  }

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      [name]: `./react-ssr-src/entry${ext}`,
    },
    output: {
      path: resolve(process.cwd(), distDir, env),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        getBabelRule(),
      ],
    },
  };
};
