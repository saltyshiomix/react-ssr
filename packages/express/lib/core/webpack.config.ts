import path from 'path';
import webpack from 'webpack';
import { smart as merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import {
  hasUserBabelrc,
  getBabelrc,
  getBabelRule,
} from './utils';

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const prodConfig: webpack.Configuration = {
  performance: {
    hints: 'warning',
  },
  output: {
    pathinfo: false,
  },
  optimization: {
    namedModules: false,
    namedChunks: false,
    // nodeEnv: 'production',
    // flagIncludedChunks: true,
    // occurrenceOrder: true,
    // sideEffects: true,
    // usedExports: true,
    // concatenateModules: true,
    // splitChunks: {
    //   minSize: 30000,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    // },
    // noEmitOnErrors: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
  ],
};

export default (entry: webpack.Entry, cacheDir: string): webpack.Configuration => {
  if (env === 'development') {
    if (hasUserBabelrc()) {
      console.log(`[ info ] custom babelrc in: ${getBabelrc()}`);
    }
  }

  let config: webpack.Configuration = {
    mode: 'development',
    context: cwd,
    entry,
    output: {
      path: path.join(cwd, cacheDir, env),
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

  if (env === 'production') {
    console.log('production');
    config = merge(config, prodConfig);
  }

  return config;
};
