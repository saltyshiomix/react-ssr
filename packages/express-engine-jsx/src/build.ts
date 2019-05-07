import { outputFileSync } from 'fs-extra';
import { sep, basename, join } from 'path';
import template from 'art-template';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.jsx'];
const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
  }),
  resolve({
    extensions,
  }),
  babel({
    extensions,
    exclude: /node_modules/,
    runtimeHelpers: true,
  }),
  commonjs({
    include: /node_modules/,
  }),
  (isProd && terser()),
];

const build = async (page: string, config: any) => {
  const rollup = require('rollup');
  const filename = basename(page);
  const input = page.replace('.jsx', '.client.jsx');
  await outputFileSync(input, template(join(__dirname, 'client.react.jsx'), { page: `./${filename}` }));

  const bundle = await rollup.rollup({
    input,
    plugins,
  });

  await bundle.write({
    file: input.replace(sep + config.viewsDir + sep, sep + '_react-ssr' + sep).replace('.client.jsx', '.js'),
    format: 'iife',
    name: 'ReactSsr',
    plugins,
  });
};

export default build;
