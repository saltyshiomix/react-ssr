import { existsSync } from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';

const cwd: string = process.cwd();
const isProd: boolean = process.env.NODE_ENV === 'production';

const babelRule = {
  test: /\.(js|ts)x?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {},
  },
};
const hasBabelrc: boolean = existsSync(resolve(cwd, '.babelrc')) || existsSync(resolve(cwd, '.babelrc.js')) || existsSync(resolve(cwd, 'babel.config.js'));
const getBabelrc = () => {
  if (existsSync(resolve(cwd, '.babelrc'))) {
    return resolve(cwd, '.babelrc');
  }
  if (existsSync(resolve(cwd, '.babelrc.js'))) {
    return resolve(cwd, '.babelrc.js');
  }
  return resolve(cwd, 'babel.config.js');
};

if (hasBabelrc) {
  const babelrc: string = getBabelrc();
  !isProd && console.log('[react-ssr] Babelrc in: ' + babelrc);
  babelRule.use.options = {
    cacheDirectory: true,
    extends: babelrc,
  };
} else {
  babelRule.use.options = {
    cacheDirectory: true,
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      require('babel-plugin-react-require'),
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-proposal-class-properties'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true,
      }],
      [require('@babel/plugin-transform-runtime'), {
        corejs: 2,
        helpers: true,
        regenerator: true,
        useESModules: false,
      }],
    ],
  };
}

export default (name: string, distDir: string): Configuration => {
  const config: Configuration = {
    mode: isProd ? 'production' : 'development',
    context: cwd,
    entry: {
      [name]: './react-ssr-src/entry.js',
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
        babelRule,
      ],
    },
  };

  // if (isProd) {
  //   config.optimization = {
  //     minimizer: [
  //       new TerserPlugin(),
  //     ],
  //   };
  // }

  return config;
};
