import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input: 'lib/register.ts',
    output: {
      file: 'dist/register.js',
      format: 'cjs',
    },
    plugins: [
      external(),
      resolve({
        extensions,
      }),
      babel({
        extensions,
        exclude: /node_modules/,
      }),
      commonjs(),
      (process.env.NODE_ENV === 'production' && terser()),
    ],
  },
];
