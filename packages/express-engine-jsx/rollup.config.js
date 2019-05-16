import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.ts', '.tsx'];

const config = (input) => {
  return {
    input,
    output: {
      dir: '.',
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
      commonjs({
        namedExports: {
          'node_modules/react-dom/server.js': [
            'renderToString',
          ],
        },
      }),
      (process.env.NODE_ENV === 'production' && terser()),
    ],
    external: [
      'react-dom/server',
    ],
  };
};

export default [
  config('src/register.ts'),
];
