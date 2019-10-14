import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import express from 'express';
import hasha from 'hasha';
import webpack from 'webpack';
import configure from './webpack.config';
import Config from './config';
import { getEngine } from './utils';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const cwd = process.cwd();
const ext = '.' + getEngine();

const getPages = (dir: string): string[] => {
  const pages: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const p = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      pages.push(...(getPages(p)));
    } else {
      pages.push(p);
    }
  }
  return pages;
};

let count = 0;
let existsFileInMFS = false;
let existsFileInFS = false;

const sleep = (ms: number) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

const waitUntilCompleted = (mfs: any, filename: string) => {
  while (!mfs.existsSync(filename)) {
    sleep(10);
  }

  fse.outputFileSync(filename, mfs.readFileSync(filename).toString());
  while (!fse.existsSync(filename)) {
    sleep(10);
  }
}

const codec = require('json-url')('lzma');
const { ufs } = require('unionfs');
const MemoryFileSystem = require('memory-fs');
const mfs = new MemoryFileSystem;
ufs.use(mfs).use(fs);
mfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

export default (app: express.Application, config: Config): void => {
  console.log('Optimizing performance...');
  console.log('');

  const pages = getPages(path.join(cwd, config.viewsDir));
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const hash = hasha(env + page, { algorithm: 'md5' });

    mfs.writeFileSync(path.join(cwd, `react-ssr-src/entry${ext}`), fse.readFileSync(path.join(__dirname, '../entry.jsx')));
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/page${ext}`), fse.readFileSync(page));

    const compiler: webpack.Compiler = webpack(configure(hash, ext, config.cacheDir));
    compiler.inputFileSystem = ufs;
    compiler.outputFileSystem = mfs;
    compiler.run((err: Error) => {
      err && console.error(err.stack || err);
    });

    const filename = path.join(cwd, config.cacheDir, env, `${hash}.js`);

    waitUntilCompleted(mfs, filename);

    const [, ...rest] = page.replace(cwd, '').split(path.sep);
    const id = rest.join('/')
    const route = '/_react-ssr/' + id;

    console.log('  ' + id);

    app.get(route, async (req, res) => {
      let script = fse.readFileSync(filename).toString();

      const props = await codec.decompress(req.query.props);

      console.log('');
      console.log(`Accessed ${route}: props:`);
      console.log(props);
      console.log('');

      res.type('.js');
      res.send(script);
    });
  }

  console.log('');
};
