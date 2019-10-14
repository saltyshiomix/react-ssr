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
  if (hasUserBabelrc()) {
    !(env === 'production') && console.log(`[ info ] use custom babelrc in: ${getBabelrc()}`);
  }

  const plugins = [new webpack.NamedModulesPlugin()];
  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    mode: env,
    context: cwd,
    entry,
    output: {
      path: path.join(cwd, cacheDir),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: env === 'production' ? {} : {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        getBabelRule(),
      ],
    },
    plugins,
  };
};
