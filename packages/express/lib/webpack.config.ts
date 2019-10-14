import path from 'path';
import webpack from 'webpack';
import {
  hasUserBabelrc,
  getBabelrc,
  getBabelRule,
} from './utils';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default (name: string, ext: string, cacheDir: string): webpack.Configuration => {
  if (hasUserBabelrc()) {
    !(env === 'production') && console.log(`[react-ssr] Babelrc in: ${getBabelrc()}`);
  }

  return {
    mode: env,
    entry: {
      [name]: `./react-ssr-src/entry${ext}`,
    },
    output: {
      path: path.join(process.cwd(), cacheDir, env),
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
