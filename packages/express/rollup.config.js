import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.ts', '.tsx'];

export default {
  input: 'lib/index.ts',
  output: {
    dir: 'dist',
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
