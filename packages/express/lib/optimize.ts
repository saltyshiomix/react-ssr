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

const normalizeAssets = (assets: any) => {
  if (require('is-object')(assets)) {
    return Object.values(assets);
  }
  return Array.isArray(assets) ? assets : [assets];
}

const codec = require('json-url')('lzw');
const { ufs } = require('unionfs');
const MemoryFileSystem = require('memory-fs');
const mfs = new MemoryFileSystem;
ufs.use(mfs).use(fs);
mfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

export default async (app: express.Application, config: Config): Promise<void> => {
  await fse.remove(config.cacheDir);
  console.log('');
  console.log('[ info ] removed all caches');

  const entry: webpack.Entry = {};
  const pages = getPages(path.join(cwd, config.viewsDir));

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const hash = hasha(env + page, { algorithm: 'md5' });
    mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${hash}`));
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/${hash}/entry${ext}`), fse.readFileSync(path.join(__dirname, '../entry.jsx')));
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/${hash}/page${ext}`), fse.readFileSync(page));
    entry[hash] = env === 'production' ? `./react-ssr-src/${hash}/entry${ext}` : ['webpack-hot-middleware/client', `./react-ssr-src/${hash}/entry${ext}`];
  }

  const webpackConfig: webpack.Configuration = configure(entry, config.cacheDir);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = mfs;

  if (env === 'development') {
    // development mode (hot module replacement)
    app.use(require('webpack-dev-middleware')(compiler, { serverSideRender: true }));
    app.use(require('webpack-hot-middleware')(compiler));

    app.use((req, res) => {
      const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
      res.send(`
<html>
  <body>
    <div id="app"></div>
    ${normalizeAssets(assetsByChunkName.main)
      .filter((path) => path.endsWith('.js'))
      .map((path) => `<script src="${path}"></script>`)
      .join('\n')}
  </body>
</html>
      `);
    });

    console.log('[ info ] enabled HMR');
    console.log('');
  }

  if (env === 'production') {
    console.log('[ info ] optimizing the performance for production...');
    console.log('');

    compiler.run((err: Error) => {
      err && console.error(err.stack || err);
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      const filename = path.join(cwd, config.cacheDir, env, `${hash}.js`);

      await waitUntilCompleted(mfs, filename);

      const [, ...rest] = page.replace(cwd, '').split(path.sep);
      const id = rest.join('/')
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
