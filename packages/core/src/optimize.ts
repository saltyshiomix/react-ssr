import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import { configureWebpack } from './webpack.config';
import {
  getSsrConfig,
  getEngine,
  getPages,
  getPageId,
  readFileWithProps,
  sleep,
  Config,
} from './helpers/core';

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const ext = '.' + getEngine();
const config: Config = getSsrConfig();
const codec = require('json-url')('lzw');

const ufs = require('unionfs').ufs;
const memfs = new MemoryFileSystem();
ufs.use(fs).use(memfs);

const getEntry = async (): Promise<[webpack.Entry, string[]]> => {
  const entry: webpack.Entry = {};
  const entryPages = await getPages();
  const entryPath = path.resolve(__dirname, '../lib/webpack/entry.js');
  const template = fse.readFileSync(entryPath).toString();

  memfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '/');
    const dir = path.dirname(pageId);
    const name = path.basename(pageId);
    if (dir !== '.') {
      memfs.mkdirpSync(path.join(cwd, 'react-ssr-src', dir));
    }
    memfs.writeFileSync(
      path.join(cwd, 'react-ssr-src', path.join(dir, `entry-${name}${ext}`)),
      template.replace('__REACT_SSR_PAGE__', page),
    );
    entry[getPageId(page, '_')] = `./${path.join(dir, `entry-${name}${ext}`)}`;
  }

  return [entry, entryPages];
};

export default async (app: express.Application): Promise<void> => {
  fse.removeSync(path.join(cwd, config.distDir));

  let compiled = false;
  const [entry, entryPages] = await getEntry();
  const webpackConfig: webpack.Configuration = configureWebpack(entry);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.inputFileSystem = ufs;
  compiler.run(async (err: Error, stats: webpack.Stats) => {
    err && console.error(err.stack || err);
    stats.hasErrors() && console.error(stats.toString());

    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const pageId = getPageId(page, '/');
      const route = `/_react-ssr/${pageId}.js`;

      console.log(`[ info ] optimized "${config.viewsDir}/${pageId}${ext}"`);

      app.get(route, async (req, res) => {
        const props = await codec.decompress(req.query.props);
        if (env === 'development') {
          console.log('[ info ] the props below is rendered from the server side');
          console.log(props);
        }

        const filename = path.join(cwd, config.distDir, env, `${getPageId(page, '_')}.js`);
        const script = readFileWithProps(filename, props);
        res.status(200).type('.js').send(script);
      });
    }

    compiled = true;
  });

  while (true) {
    if (compiled) {
      break;
    }
    await sleep(100);
  }
};
