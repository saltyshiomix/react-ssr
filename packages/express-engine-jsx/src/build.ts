import { outputFileSync } from 'fs-extra';
import { sep, basename, join } from 'path';
import template from 'art-template';
import rollup from 'rollup';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProd: boolean = process.env.NODE_ENV === 'production';
const extensions: string[] = ['.js', '.jsx'];
const plugins: rollup.Plugin[] = [
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

const build = async (page: string, config: any, props: any): Promise<void> => {
  const filename: string = basename(page);
  const input: string = page.replace('.jsx', '.page.jsx');

  await outputFileSync(input, template(join(__dirname, 'client.jsx'), { page: `./${filename}`, props }));

  const bundle: rollup.RollupBuild = await rollup.rollup({
    input,
    plugins,
  });

  await bundle.write({
    file: input.replace(sep + config.viewsDir + sep, sep + '_react-ssr' + sep).replace('.page.jsx', '.js'),
    format: 'iife',
    name: 'ReactSsrExpress',
  });
};

export default build;
