import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  rollup,
  RollupBuild,
} from 'rollup';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
// import virtual from 'rollup-plugin-virtual';
import hypothetical from 'rollup-plugin-hypothetical';
import { terser } from 'rollup-plugin-terser';

const isProd: boolean = process.env.NODE_ENV === 'production';
const extensions: string[] = ['.js', '.jsx'];

export default async (input: string, file: string, props: any): Promise<RollupBuild> => {
  const cwd: string = process.cwd();
  const page: string = readFileSync(file).toString();
  const propsString: string = `export default ${JSON.stringify(props)}`

  return await rollup({
    input: './test.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      // virtual({
      //   [input]: readFileSync(input).toString(),
      //   './react-ssr-page.js': page,
      //   './react-ssr-props.js': propsString,
      // }),
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
      hypothetical({
        files: {
          './test.js': readFileSync(input).toString(),
          './react-ssr-page.js': page,
          './react-ssr-props.js': propsString,
          [resolve(cwd, 'node_modules/react/index.js')]: readFileSync(resolve(cwd, 'node_modules/react/index.js')).toString(),
          [resolve(cwd, 'node_modules/react-dom/index.js')]: readFileSync(resolve(cwd, 'node_modules/react-dom/index.js')).toString(),
        },
      }),
      (isProd && terser()),
    ],
  });
}
