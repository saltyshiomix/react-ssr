import external from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.ts', '.tsx'];

const configure = (input, output) => ({
  input,
  output: {
    file: output,
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
  configure('lib/config.ts', 'dist/config.js'),
  configure('lib/render.tsx', 'dist/render.js'),
  configure('lib/ssr.tsx', 'dist/ssr.js'),
  configure('lib/webpack.config.ts', 'dist/webpack.config.js'),
  configure('lib/helpers.ts', 'dist/helpers.js'),
];
