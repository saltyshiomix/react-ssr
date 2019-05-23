import { existsSync } from 'fs';
import { resolve } from 'path';

const cwd: string = process.cwd();

export default (): string|Function => {
  if (existsSync(resolve(cwd, '.babelrc'))) return resolve(cwd, '.babelrc');
  if (existsSync(resolve(cwd, '.babelrc.js'))) return resolve(cwd, '.babelrc.js');
  if (existsSync(resolve(cwd, 'babel.config.js'))) return resolve(cwd, 'babel.config.js');

  return (api: any) => {
    api.cache(true);

    const presets = [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ];

    const plugins = [
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
    ];

    return {
      presets,
      plugins
    };
  }
}
