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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitUntilCompleted = async (mfs: any, filename: string) => {
  const existsInMFS = mfs.existsSync(filename);
  const existsInFS = fse.existsSync(filename)
  if (existsInMFS && existsInFS) {
    return;
  }
  if (existsInMFS) {
    fse.outputFileSync(filename, mfs.readFileSync(filename).toString());
  }
  await sleep(15);
  waitUntilCompleted(mfs, filename);
}

const codec = require('json-url')('lzw');
const { ufs } = require('unionfs');
const MemoryFileSystem = require('memory-fs');
const mfs = new MemoryFileSystem;
ufs.use(mfs).use(fs);
mfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

export default async (app: express.Application, config: Config): Promise<void> => {
  console.log('');
  console.log('[ info ] optimizing performance...');
  console.log('');

  await fse.remove(config.cacheDir);
  console.log('  [ ok ] removed all caches');

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

    await waitUntilCompleted(mfs, filename);

    const [, ...rest] = page.replace(cwd, '').split(path.sep);
    const id = rest.join('/')
    const route = '/_react-ssr/' + id.replace(ext, '.js');

    console.log('  [ ok ] ' + id);
    await sleep(150);

    app.get(route, async (req, res) => {
      const props = await codec.decompress(req.query.props);
      if (env !== 'production') {
        console.log('');
        console.log(`[ info ] the props below is rendered by server side dynamically`);
        console.log(props);
      }

      let script = fse.readFileSync(filename).toString()
                      .replace(
                        '__REACT_SSR__',
                        JSON.stringify(props).replace(/"/g, '\\"'),
                      );

      res.type('.js');
      res.send(script);
    });
  }

  console.log('');
};
