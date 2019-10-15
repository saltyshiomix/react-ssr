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

    const WriteFilePlugin = require('write-file-webpack-plugin');
    plugins.push(new WriteFilePlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // const [, ...rest] = file.replace(process.cwd(), '').replace(ext, '.js').split(path.sep);
  // const route: string = '/_react-ssr/' + rest.join('/');

  return {
    mode: env,
    context: cwd,
    entry,
    output: {
      path: path.join(cwd, cacheDir, env),
      publicPath: `/_react-ssr/views/`,
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
    plugins,
  };
};
