import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.ts', '.tsx'];

export default [
  {
    input: 'lib/index.ts',
    output: {
      file: 'dist/index.js',
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
      json(),
      (process.env.NODE_ENV === 'production' && terser()),
    ],
    external: [
      '@react-ssr/core/helpers',
      '@react-ssr/core/express/config',
      '@react-ssr/core/express/render',
      '@react-ssr/core/webpack/configure',
    ],
  }
];
