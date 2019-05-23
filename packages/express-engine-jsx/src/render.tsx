import fs from 'fs';
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
import delay from 'delay';
import webpack from 'webpack';
import configure from './webpack.config';
import Html from './html';

template.defaults.minimize = false;

const getPagePath = (file: string, config: Config): string => {
  return file.split(sep + config.viewsDir + sep)[1];
};

const waitUntilBuilt = async (dist: string, mfs: any) => {
  while (true) {
    if (mfs.existsSync(dist)) {
      break;
    }
    await delay(30);
  }
}

const MemoryFileSystem = require('memory-fs');

const render = async (file: string, config: Config, props: any): Promise<string> => {
  let html: string = '<!DOCTYPE html>';

  const cwd: string = process.cwd();
  const distDir: string = config.distDir as string;
  const pagePath: string = getPagePath(file, config);

  const cache: string = resolve(cwd, distDir, pagePath.replace('.jsx', '.html'));
  if (existsSync(cache)) {
    return readFileSync(cache).toString();
  }

  const name: string = basename(pagePath).replace('.jsx', '');
  const compiler: webpack.Compiler = webpack(configure(name, distDir));
  const mfs = new MemoryFileSystem;
  const { ufs } = require('unionfs');
  ufs.use(mfs).use(fs);
  mfs.mkdirpSync(resolve(cwd, 'react-ssr-src'));
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/entry.js'), template(resolve(__dirname, 'page.jsx'), { props }));
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/page.js'), template(file, props));
  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = mfs;

  try {
    compiler.run((err: any) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }
    });

    const script: string = resolve(cwd, distDir, pagePath).replace('.jsx', '.js');
    await waitUntilBuilt(script, mfs);
    await outputFileSync(script, mfs.readFileSync(script).toString());

    let Page = require(file);
    Page = Page.default || Page;

    html += renderToString(
      <Html script={pagePath.replace('.jsx', '.js')}>
        <Page {...props} />
      </Html>
    );

    return html;

  } finally {
    // await outputFileSync(cache, html);
  }
};

export default render;
