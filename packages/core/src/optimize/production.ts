import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import { configureWebpack } from './webpack.config';
import { getEntry } from './helpers';
import {
  getSsrConfig,
  getPageId,
  sleep,
} from '../helpers';

const cwd = process.cwd();
const config = getSsrConfig();

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
  compiler.run((err: Error, stats: webpack.Stats) => {
    err && console.error(err.stack || err);
    stats.hasErrors() && console.error(stats.toString());

    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const pageId = getPageId(page, '_');

      app.use(`/_react-ssr/${pageId}.css`, (req, res) => {
        const filename = path.join(cwd, config.distDir, `${pageId}.css`);
        const style = fs.existsSync(filename) ? fs.readFileSync(filename).toString() : '';
        res.writeHead(200, { 'Content-Type': 'text/css' })
        res.end(style, 'utf-8');
      });

      app.use(`/_react-ssr/${pageId}.js`, (req, res) => {
        const filename = path.join(cwd, config.distDir, `${pageId}.js`);
        const script = fs.readFileSync(filename).toString();
        res
          .status(200)
          .type('.js')
          .send(script);
      });
    }
  });

  while (true) {
    if (compiled) {
      break;
    }
    await sleep(100);
  }

  // TODO: use promise
  // wait until completed
  await sleep(1000);
};
