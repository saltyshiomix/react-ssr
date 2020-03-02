import external from 'rollup-plugin-auto-external';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const commonConfig = {
  plugins: [
    external(),
    resolve({
      extensions,
    }),
    babel({
      extensions,
      runtimeHelpers: true,
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
    'http-proxy-middleware',
  ],
};

const cliConfig = (src) => ({
  input: src,
  output: {
    dir: 'dist',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  ...commonConfig,
});

const fileConfig = (src, dist) => ({
  input: src,
  output: {
    file: dist,
    format: 'cjs',
  },
  ...commonConfig,
});

export default [
  cliConfig('src/static.ts'),
  cliConfig('src/static-dev.ts'),
  cliConfig('src/static-build.ts'),
  fileConfig('src/components/Document/index.tsx', 'dist/document.js'),
  fileConfig('src/components/Document/context.ts', 'dist/document-context.js'),
  fileConfig('src/components/Head/index.tsx', 'dist/head.js'),
  fileConfig('src/components/Main.tsx', 'dist/main.js'),
];
