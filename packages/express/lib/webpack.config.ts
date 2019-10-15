import path from 'path';
import webpack from 'webpack';
import {
  hasUserBabelrc,
  getBabelrc,
  getBabelRule,
} from './utils';

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default (entry: webpack.Entry, cacheDir: string): webpack.Configuration => {
  const plugins = [];

  if (env === 'development') {
    if (hasUserBabelrc()) {
      console.log(`[ info ] use custom babelrc in: ${getBabelrc()}`);
    }

    // const WriteFilePlugin = require('write-file-webpack-plugin');
    // plugins.push(new WriteFilePlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    mode: env,
    context: cwd,
    entry,
    output: {
      path: path.join(cwd, cacheDir, env),
      filename: '[name].js',
      publicPath: '/_react-ssr/views/',
      // hotUpdateChunkFilename: 'hot/hot-update.js',
      // hotUpdateMainFilename: 'hot/hot-update.json',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        getBabelRule(),
      ],
    },
    plugins,
  };
};
