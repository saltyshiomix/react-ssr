import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { smart as merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { getSsrConfig } from './helpers';

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const getBabelrc = (): string | undefined => {
  if (fs.existsSync(path.join(cwd, '.babelrc'))) return path.join(cwd, '.babelrc');
  if (fs.existsSync(path.join(cwd, '.babelrc.js'))) return path.join(cwd, '.babelrc.js');
  if (fs.existsSync(path.join(cwd, 'babel.config.js'))) return path.join(cwd, 'babel.config.js');
  return undefined;
};

const prodConfig: webpack.Configuration = {
  performance: {
    hints: 'warning',
  },
  output: {
    pathinfo: false,
  },
  optimization: {
    nodeEnv: 'production',
    namedModules: false,
    namedChunks: false,
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    splitChunks: {
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

export const configureWebpack = (entry: webpack.Entry): webpack.Configuration => {
  const babelrc = getBabelrc();
  if (!babelrc) {
    throw new Error('Not found: .babelrc or .babelrc.js or babel.config.js');
  }

  const ssrConfig = getSsrConfig();

  let config: webpack.Configuration = {
    mode: 'development',
    context: path.join(cwd, 'react-ssr-src'),
    entry,
    output: {
      path: path.join(cwd, ssrConfig.distDir),
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              extends: babelrc,
            },
          },
        },
      ],
    },
  };

  if (env === 'production') {
    config = merge(config, prodConfig);
  }

  if (ssrConfig.webpack) {
    if (typeof ssrConfig.webpack === 'function') {
      config = ssrConfig.webpack(config, env);
    } else {
      console.warn('[ warn ] ssr.config.js#webpack must be a function');
    }
  }

  return config;
};
