import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { smart as merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { getStaticConfig } from '../helpers';

console.log('webpack');

console.log(getStaticConfig);

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const staticConfig = getStaticConfig();

console.log('a');

const getBabelrc = (): string | undefined => {
  if (fs.existsSync(path.join(cwd, '.babelrc'))) return path.join(cwd, '.babelrc');
  if (fs.existsSync(path.join(cwd, '.babelrc.js'))) return path.join(cwd, '.babelrc.js');
  if (fs.existsSync(path.join(cwd, 'babel.config.js'))) return path.join(cwd, 'babel.config.js');
  return undefined;
};

console.log('b');

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
    concatenateModules: false,
    splitChunks: {
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    },
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

console.log('c');

export const configureWebpack = (entry: webpack.Entry): webpack.Configuration => {
  const babelrc = getBabelrc();
  if (!babelrc) {
    throw new Error('Not found: .babelrc or .babelrc.js or babel.config.js');
  }

  // fix import .scss files
  require.extensions['.scss'] = () => {};

  let config: webpack.Configuration = {
    mode: 'development',
    entry,
    output: {
      path: path.join(cwd, staticConfig.distDir),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              extends: babelrc,
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.join(cwd, staticConfig.distDir),
                hmr: env === 'development',
                reloadAll: true,
              },
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.join(cwd, staticConfig.distDir),
                hmr: env === 'development',
                reloadAll: true,
              },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: env === 'development',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: true,
      }),
    ],
  };

  if (env === 'production') {
    config = merge(config, prodConfig);
  }

  if (staticConfig.webpack) {
    if (typeof staticConfig.webpack === 'function') {
      config = staticConfig.webpack(config, env);
    } else {
      console.warn('[ warn ] static.config.js#webpack must be a function');
    }
  }

  return config;
};
