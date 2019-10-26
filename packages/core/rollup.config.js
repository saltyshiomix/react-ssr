import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const config = (src, dist) => ({
  input: src,
  output: {
    file: dist,
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
});

export default [
  config('lib/index.ts', 'dist/index.js'),
  config('lib/head.tsx', 'dist/head.js'),
  config('lib/script.tsx', 'dist/script.js'),
];
