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
const codec = require('json-url')('lzw');

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

export default async (app: express.Application, config: Config): Promise<void> => {
  await fse.remove(config.cacheDir);

  console.log('');
  console.log('[ info ] removed all caches');

  const entry: webpack.Entry = {};
  const pages = getPages(path.join(cwd, config.viewsDir));

  if (env === 'development') {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      const [, ...rest] = page.replace(cwd, '').split(path.sep);
      const id = rest.join('/');
      entry[hash] = ['webpack-hot-middleware/client', `./${id}`];
    }

    const webpackConfig: webpack.Configuration = configure(entry, config.cacheDir);
    const compiler: webpack.Compiler = webpack(webpackConfig);

    // compiler.watch({}, (err: Error) => {
    //   err && console.error(err.stack || err);
    // });

    app.use(require('webpack-dev-middleware')(compiler, {
      // serverSideRender: true,
      logLevel: 'silent',
      writeToDisk: true,
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      const filename = path.join(cwd, config.cacheDir, `${hash}.js`);
      const [, ...rest] = page.replace(cwd, '').split(path.sep);
      const route = '/_react-ssr/' + rest.join('/').replace(ext, '.js');

      app.get(route, async (req, res) => {
        const props = await codec.decompress(req.query.props);

        console.log('[ info ] props below is rendered from server side');
        console.log(props);

        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

        console.log('assetsByChunkName.main');
        console.log(assetsByChunkName.main);

        const script = fse.readFileSync(filename).toString()
                        .replace(
                          '__REACT_SSR__',
                          JSON.stringify(props).replace(/"/g, '\\"'),
                        );

        res.type('.js');
        res.send(script);
      });

      console.log('[ info ] enabled HMR');
    }
  }

  if (env === 'production') {
    console.log('[ info ] optimizing the performance for production...');
    console.log('');

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

    const { ufs } = require('unionfs');
    const MemoryFileSystem = require('memory-fs');
    const mfs = new MemoryFileSystem;
    ufs.use(mfs).use(fs);
    mfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${hash}`));
      mfs.writeFileSync(path.join(cwd, `react-ssr-src/${hash}/entry${ext}`), fse.readFileSync(path.join(__dirname, '../entry.jsx')));
      mfs.writeFileSync(path.join(cwd, `react-ssr-src/${hash}/page${ext}`), fse.readFileSync(page));
      entry[hash] = `./react-ssr-src/${hash}/entry${ext}`;
    }

    const webpackConfig: webpack.Configuration = configure(entry, config.cacheDir);
    const compiler: webpack.Compiler = webpack(webpackConfig);
    compiler.inputFileSystem = ufs;
    compiler.outputFileSystem = mfs;
    compiler.run((err: Error) => {
      err && console.error(err.stack || err);
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      const filename = path.join(cwd, config.cacheDir, `${hash}.js`);

      await waitUntilCompleted(mfs, filename);

      const [, ...rest] = page.replace(cwd, '').split(path.sep);
      const id = rest.join('/');
      const route = '/_react-ssr/' + id.replace(ext, '.js');

      console.log(`  [ ok ] optimized "${id}"`);

      await sleep(50);

      app.get(route, async (req, res) => {
        const props = await codec.decompress(req.query.props);
        const script = fse.readFileSync(filename).toString()
                        .replace(
                          '__REACT_SSR__',
                          JSON.stringify(props).replace(/"/g, '\\"'),
                        );
  
        res.type('.js');
        res.send(script);
      });
    }

    console.log('');
  }
};
