import {
  existsSync,
  readFileSync,
  outputFileSync,
} from 'fs-extra';
import {
  sep,
  dirname,
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

const waitUntilBuilt = (dist: string, mfs: any, timeout: number) => {
  return new Promise((resolve, reject) => {
    const dir: string = dirname(dist);
    const name: string = basename(dist);
    const watcher = mfs.watch(dir, function (eventType: string, filename: string) {
      if (eventType === 'rename' && filename === name) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });
    const timer = setTimeout(() => {
      watcher.close();
      reject(new Error('File did not exists and was not created during the timeout.'));
    }, timeout);
    // mfs.access(dist, mfs.constants.R_OK, (err: any) => {
    //   if (!err) {
    //     clearTimeout(timer);
    //     watcher.close();
    //     resolve();
    //   }
    // });
  });
}

const render = (file: string, config: Config, props: any): string => {
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
  const compiler: WebpackComplier = webpack(configure(name, distDir));

  process.env.MEMFS_DONT_WARN = 'true';
  const fs = require('fs');
  const { fs: mfs } = require('memfs');
  const { ufs } = require('unionfs');

  mfs.mkdirSync(resolve(cwd, 'react-ssr-src'), { recursive: true });
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/entry.js'), entryContents);
  mfs.writeFileSync(resolve(cwd, 'react-ssr-src/page.js'), pageContents);
  ufs.use(mfs).use(fs);

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

    const script: string = page.replace('.jsx', '.js');
    const TIMEOUT: number = 5000;
    waitUntilBuilt(script, mfs, TIMEOUT).then(() => outputFileSync(script, mfs.readFileSync(script).toString()));

    let Page = require(file);
    Page = Page.default || Page;

    html += renderToString(
      <Html script={script}>
        <Page {...props} />
      </Html>
    );

    return html;

  } finally {
    outputFileSync(cache, html);
  }
};

export default render;
