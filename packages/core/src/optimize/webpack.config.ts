import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import {
  existsSync,
  ssrConfig,
  isProd,
} from '../helpers';

const cwd = process.cwd();

const getBabelrc = (): string | undefined => {
  if (existsSync(path.join(cwd, '.babelrc'))) return path.join(cwd, '.babelrc');
  if (existsSync(path.join(cwd, '.babelrc.js'))) return path.join(cwd, '.babelrc.js');
  if (existsSync(path.join(cwd, 'babel.config.js'))) return path.join(cwd, 'babel.config.js');
  return path.join(__dirname, '../../lib/babel.js');
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
    // namedModules: false,
    // namedChunks: false,
    flagIncludedChunks: true,
    // occurrenceOrder: true,
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
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

export const configureWebpack = (entry: webpack.Entry): webpack.Configuration => {
  let config: webpack.Configuration = {
    mode: 'development',
    devtool: isProd() ? false : 'eval-source-map',
    entry,
    output: {
      path: path.join(cwd, ssrConfig.distDir),
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
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              extends: getBabelrc(),
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.join(cwd, ssrConfig.distDir),
                hmr: !isProd(),
                reloadAll: true,
              },
            },
            {
              loader: require.resolve('css-loader'),
            },
          ],
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.join(cwd, ssrConfig.distDir),
                hmr: !isProd(),
                reloadAll: true,
              },
            },
            {
              loader: require.resolve('css-loader'),
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: !isProd(),
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

  if (isProd()) {
    config = merge(config, prodConfig);
  }

  if (ssrConfig.webpack) {
    if (typeof ssrConfig.webpack === 'function') {
      config = ssrConfig.webpack(config, isProd() ? 'production' : 'development');
    } else {
      console.warn('[ warn ] ssr.config.js#webpack must be a function');
    }
  }

  return config;
};
