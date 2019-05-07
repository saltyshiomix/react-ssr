import {
  rollup,
  RollupBuild,
  Plugin,
} from 'rollup';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProd: boolean = process.env.NODE_ENV === 'production';
const extensions: string[] = ['.js', '.jsx'];
const plugins: Plugin[] = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
  }),
  nodeResolve({
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

export default async (input: string): Promise<RollupBuild> => {
  return await rollup({
    input,
    plugins,
  });
}
