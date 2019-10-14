import path from 'path';
import webpack from 'webpack';
import {
  hasUserBabelrc,
  getBabelrc,
  getBabelRule,
} from './utils';

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
    entry,
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
    plugins,
  };
};
