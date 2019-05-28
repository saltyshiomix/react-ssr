import fs from 'fs';
import {
  existsSync,
  readFileSync,
  outputFileSync,
} from 'fs-extra';
import { resolve } from 'path';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import delay from 'delay';
import hasha from 'hasha';
import webpack from 'webpack';
import configure from './webpack.config';
import Html from './html';
import { Config } from './config';
import { getEngine } from './utils';

template.defaults.minimize = false;

const waitUntilBuilt = async (dist: string, mfs: any) => {
  while (true) {
    if (mfs.existsSync(dist)) {
      break;
    }
    await delay(15);
  }
}

const cwd: string = process.cwd();
const ext: '.jsx'|'.tsx' = `.${getEngine()}` as '.jsx'|'.tsx';
const { ufs } = require('unionfs');
const MemoryFileSystem = require('memory-fs');

const render = async (file: string, config: Config, props: any): Promise<string> => {
  let html: string = '<!DOCTYPE html>';

  const { distDir } = config;

  const hash: string = await hasha(file + JSON.stringify(props), { algorithm: 'md5' });
  const cacheScript: string = resolve(cwd, distDir as string, `${hash}.js`);
  const cacheHtml: string = resolve(cwd, distDir as string, `${hash}.html`);
  if (existsSync(cacheScript) && existsSync(cacheHtml)) {
    return readFileSync(cacheHtml).toString();
  }

  const compiler: webpack.Compiler = webpack(configure(hash, ext, distDir as string));
  const mfs = new MemoryFileSystem;

  ufs.use(mfs).use(fs);
  mfs.mkdirpSync(resolve(cwd, 'react-ssr-src'));
  mfs.writeFileSync(resolve(cwd, `react-ssr-src/entry${ext}`), template(resolve(__dirname, '../page.jsx'), { props }));
  mfs.writeFileSync(resolve(cwd, `react-ssr-src/page${ext}`), template(file, props));

  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = mfs;
  compiler.run((err: any) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });

  await waitUntilBuilt(cacheScript, mfs);
  await outputFileSync(cacheScript, mfs.readFileSync(cacheScript).toString());

  let Page = require(file);
  Page = Page.default || Page;

  html += renderToString(
    <Html script={`${hash}.js`}>
      <Page {...props} />
    </Html>
  );

  try {
    return html;
  } finally {
    await outputFileSync(cacheHtml, html);
  }
};

export default render;
