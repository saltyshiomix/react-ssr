import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const coreConfig = {
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

const dirConfig = (src, dist) => ({
  input: src,
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  ...coreConfig,
});

const fileConfig = (src, dist) => ({
  input: src,
  output: {
    file: dist,
    format: 'cjs',
  },
  ...coreConfig,
});

export default [
  dirConfig('src/register.ts'),
  fileConfig('src/ssr/head.tsx', 'dist/head.js'),
  fileConfig('src/ssr/script.tsx', 'dist/script.js'),
];
