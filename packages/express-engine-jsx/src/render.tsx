import {
  existsSync,
  readFileSync,
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

const getPagePath = (file: string, config: Config): string => {
  return file.split(sep + config.viewsDir + sep)[1];
};

const render = async (file: string, config: Config, props: any): Promise<string> => {
  let html: string = '<!DOCTYPE html>';

  const cwd: string = process.cwd();
  const distDir: string = config.distDir as string;
  const pagePath: string = getPagePath(file, config);

  const cache: string = resolve(cwd, distDir, pagePath.replace('.jsx', '.html'));
  if (existsSync(cache)) {
    return readFileSync(cache).toString();
  }

  const page: string = resolve(cwd, distDir, pagePath);
  const name: string = basename(page).replace('.jsx', '');
  const entryContents: string = template(resolve(__dirname, 'page.jsx'), { props });
  const pageContents: string = template(file, props);
  const compiler: webpack.Compiler = webpack(configure(name, distDir));

  const { Union } = require('unionfs');
  const MemoryFS = require('memory-fs');
  const fs = require('fs');
  const ufs = new Union();
  const mfs = new MemoryFS();

  mfs.mkdirpSync('/react-ssr-src');
  mfs.writeFileSync('/react-ssr-src/entry.js', entryContents, 'utf-8');
  mfs.writeFileSync('/react-ssr-src/page.js', pageContents, 'utf-8');

  ufs.use(mfs).use(fs);

  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = fs;

  try {
    compiler.run((err, stats) => {
      if (err) {
        throw err;
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log(stats.toString());
      }
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
    await outputFileSync(cache, html);
  }
};

export default render;
