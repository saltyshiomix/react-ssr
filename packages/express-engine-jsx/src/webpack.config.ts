import { existsSync } from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const cwd: string = process.cwd();
const isProd: boolean = process.env.NODE_ENV !== 'production';

export default (name: string, distDir: string): Configuration => {
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

    console.log('[react-ssr] Use babelrc in: ' + babelrc);

    babelRule.use.options = {
      extends: babelrc,
    };
  } else {
    babelRule.use.options = {
      presets: [
        '@react-ssr/express-engine-jsx/babel',
      ],
    };
  }

  const config: Configuration = {
    mode: isProd ? 'production' : 'development',
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

  if (isProd) {
    config.optimization = {
      minimizer: [
        new TerserPlugin(),
      ],
    };
  }

  return config;
};
