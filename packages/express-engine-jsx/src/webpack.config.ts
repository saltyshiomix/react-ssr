import { resolve } from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const cwd: string = process.cwd();
const isProd: boolean = process.env.NODE_ENV !== 'production';

export default (name: string, distDir: string): Configuration => {
  const config: Configuration = {
    mode: isProd ? 'production' : 'development',
    context: cwd,
    entry: {
      [name]: '/react-ssr-src/entry.js',
    },
    output: {
      path: resolve(cwd, distDir),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };

  if (isProd) {
    config.optimization = {
      minimizer: [
        new TerserPlugin(),
      ],
    };
  }

  return config;
};
