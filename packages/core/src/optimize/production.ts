import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import { configureWebpack } from '../webpack.config';
import { getEntry } from './helpers';
import {
  getSsrConfig,
  getEngine,
  getPageId,
  readFileWithProps,
  sleep,
} from '../helpers';

const cwd = process.cwd();
const ext = '.' + getEngine();
const config = getSsrConfig();
const codec = require('json-url')('lzw');

const ufs = require('unionfs').ufs;
const memfs = new MemoryFileSystem();
ufs.use(fs).use(memfs);

export default async (app: express.Application): Promise<void> => {
  fse.removeSync(path.join(cwd, config.distDir));

  let compiled = false;
  const [entry, entryPages] = await getEntry(memfs);
  const webpackConfig: webpack.Configuration = configureWebpack(entry);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.hooks.afterCompile.tap('finish', () => { compiled = true });
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
        const filename = path.join(cwd, config.distDir, `${getPageId(page, '_')}.js`);
        const script = readFileWithProps(filename, props);
        res.status(200).type('.js').send(script);
      });
    }
  });

  while (true) {
    if (compiled) {
      break;
    }
    await sleep(100);
  }
};
