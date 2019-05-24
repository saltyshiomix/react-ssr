import fs from 'fs';
import { outputFileSync } from 'fs-extra';
import {
  basename,
  resolve,
} from 'path';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import delay from 'delay';
import webpack from 'webpack';
import configure from './webpack.config';
import engine from './engine';
import Html from './html';
import { Config } from './config';
import { getPagePath } from './utils';

template.defaults.minimize = false;

const waitUntilBuilt = async (dist: string, mfs: any) => {
  while (true) {
    if (mfs.existsSync(dist)) {
      break;
    }
    await delay(30);
  }
}

const cwd: string = process.cwd();
const ext: '.jsx'|'.tsx' = `.${engine()}` as '.jsx'|'.tsx';
const { ufs } = require('unionfs');
const MemoryFileSystem = require('memory-fs');

const render = async (file: string, config: Config, props: any): Promise<string> => {
  let html: string = '<!DOCTYPE html>';

  const { distDir, viewsDir } = config;
  const pagePath: string = getPagePath(file, viewsDir as string);
  const name: string = basename(pagePath).replace(ext, '');
  const compiler: webpack.Compiler = webpack(configure(name, ext, distDir as string));
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

  const script: string = resolve(cwd, distDir as string, pagePath).replace(ext, '.js');
  await waitUntilBuilt(script, mfs);
  await outputFileSync(script, mfs.readFileSync(script).toString());

  let Page = require(file);
  Page = Page.default || Page;

  html += renderToString(
    <Html script={pagePath.replace(ext, '.js')}>
      <Page {...props} />
    </Html>
  );

  return html;
};

export default render;
