import {
  // existsSync,
  // readFileSync,
  outputFileSync,
} from 'fs-extra';
import {
  sep,
  basename,
  resolve,
} from 'path';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Config } from '@react-ssr/express';
import Html from './html';
import webpack from 'webpack';
import configure from './webpack.config';

template.defaults.minimize = false;

interface WebpackComplier extends webpack.Compiler {
  resolvers?: any;
}

const getPagePath = (file: string, config: Config): string => {
  return file.split(sep + config.viewsDir + sep)[1];
};

const render = (file: string, config: Config, props: any): string => {
  let html: string = '<!DOCTYPE html>';

  const cwd: string = process.cwd();
  const distDir: string = config.distDir as string;
  const pagePath: string = getPagePath(file, config);

  const cache: string = resolve(cwd, distDir, pagePath.replace('.jsx', '.html'));
  // if (existsSync(cache)) {
  //   return readFileSync(cache).toString();
  // }

  const page: string = resolve(cwd, distDir, pagePath);
  const name: string = basename(page).replace('.jsx', '');
  const entryContents: string = template(resolve(__dirname, 'page.jsx'), { props });
  const pageContents: string = template(file, props);
  const compiler: WebpackComplier = webpack(configure(name, distDir));

  console.log(`[react-ssr] Building ${name}.js`);

  process.env.MEMFS_DONT_WARN = 'true';
  const fs = require('fs');
  // const { createFsFromVolume, Volume } = require('memfs');
  const { ufs } = require('unionfs');

  const MemoryFS = require("memory-fs");
  const mfs = new MemoryFS;
  mfs.mkdirpSync(resolve(cwd, 'react-ssr-src'));
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/entry.js'), entryContents);
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/page.js'), pageContents);
  // const vol = new Volume;
  // vol.fromJSON({
  //   './react-ssr-src/entry.js': entryContents,
  //   './react-ssr-src/page.js': pageContents,
  // }, cwd);
  // vol.mkdirSync('./react-ssr-src', { recursive: true });
  // vol.writeFileSync('./react-ssr-src/entry.js', entryContents, 'utf-8');
  // vol.writeFileSync('./react-ssr-src/page.js', pageContents, 'utf-8');
  // const mfs = createFsFromVolume(vol);
  ufs.use(mfs).use(fs);

  compiler.inputFileSystem = ufs;
  // compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
  // compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
  compiler.outputFileSystem = mfs;

  try {
    compiler.run((err: any, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const dist: string = resolve(cwd, distDir, name, '.js')
      const output: string = mfs.readFileSync(dist).toString();
      console.log(output);
      outputFileSync(dist, output);

      // const info = stats.toJson();

      // if (stats.hasErrors()) {
      //   console.error(info.errors);
      // }
      // if (stats.hasWarnings()) {
      //   console.warn(info.warnings);
      // }

      // console.log(stats.toString({
      //   chunks: false,
      //   colors: true,
      // }));
    });

    let Page = require(file);
    Page = Page.default || Page;

    html += renderToString(
      <Html script={pagePath.replace('.jsx', '.js')}>
        <Page {...props} />
      </Html>
    );

    return html;

  } finally {
    outputFileSync(cache, html);
  }
};

export default render;
