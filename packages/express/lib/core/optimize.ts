import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import net from 'net';
import http from 'http';
import express from 'express';
import webpack from 'webpack';
import configure from './webpack.config';
import Config from './config';
import {
  getEngine,
  getPages,
  getPageId,
  readFileWithProps,
  gracefullyShutDown,
} from './utils';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const cwd = process.cwd();
const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitUntilCompleted = async (mfs: any, filename: string) => {
  const existsInMFS = mfs.existsSync(filename);
  const existsInFS = fse.existsSync(filename);
  if (existsInMFS && existsInFS) {
    return;
  }
  if (existsInMFS) {
    const _env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      fse.mkdirsSync(path.dirname(filename));
      fse.writeFileSync(filename, mfs.readFileSync(filename).toString());
    } finally {
      process.env.NODE_ENV = _env;
    }
  }
  await sleep(100);
  waitUntilCompleted(mfs, filename);
}

// onchange bundling
async function bundle(config: Config, ufs: any, mfs: any): Promise<void>;

// initial bundling
async function bundle(config: Config, ufs: any, mfs: any, app: express.Application): Promise<void>;

async function bundle(config: Config, ufs: any, mfs: any, app?: express.Application) {
  const entry: webpack.Entry = {};
  const [entryPages, otherPages] = await getPages(config);
  const template = fse.readFileSync(path.join(__dirname, '../entry.js')).toString();

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, config, '/');
    const dir = path.dirname(pageId);
    const name = path.basename(pageId);
    if (dir !== '.') {
      mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dir}`));
    }
    mfs.writeFileSync(
      path.join(cwd, `react-ssr-src/${path.join(dir, `entry-${name}${ext}`)}`),
      template.replace('__REACT_SSR_PAGE_NAME__', name),
    );
    mfs.writeFileSync(
      path.join(cwd, `react-ssr-src/${path.join(dir, name + ext)}`),
      fse.readFileSync(page),
    );
    entry[getPageId(page, config, '_')] = `./react-ssr-src/${path.join(dir, `entry-${name}${ext}`)}`;
  }

  for (let i = 0; i < otherPages.length; i++) {
    const page = otherPages[i];
    const pageId = getPageId(page, config, '/');
    const dir = path.dirname(pageId);
    const name = path.basename(pageId);
    if (dir !== '.') {
      mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dir}`));
    }
    mfs.writeFileSync(
      path.join(cwd, `react-ssr-src/${path.join(dir, name + ext)}`),
      fse.readFileSync(page),
    );
  }

  const webpackConfig: webpack.Configuration = configure(entry, config.cacheDir);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.inputFileSystem = ufs;
  compiler.outputFileSystem = mfs;
  compiler.run((err: Error) => {
    err && console.error(err.stack || err);
  });

  if (app) {
    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const filename = path.join(cwd, config.cacheDir, env, `${getPageId(page, config, '_')}.js`);

      await waitUntilCompleted(mfs, filename);

      const pageId = getPageId(page, config, '/');
      const route = `/_react-ssr/${pageId}.js`;

      console.log(`[ info ] optimized "${config.viewsDir}/${pageId}${ext}"`);

      app.get(route, async (req, res) => {
        const props = await codec.decompress(req.query.props);
        if (env === 'development') {
          console.log('[ info ] the props below is rendered from the server side');
          console.log(props);
        }

        const script = readFileWithProps(filename, props, mfs);
        res.type('.js').send(script);
      });
    }
  } else {
    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const filename = path.join(cwd, config.cacheDir, env, `${getPageId(page, config, '_')}.js`);
      await waitUntilCompleted(mfs, filename);
    }
  }

  console.log('[ info ] writing caches. please wait...');

  await sleep(env === 'production' ? 3000 : 2000);
};

export default async (app: express.Application, server: http.Server, config: Config): Promise<http.Server> => {
  let reloadable: any = false;
  if (env === 'development') {
    const reload = require('reload');
    reloadable = await reload(app);
  }

  await fse.remove(path.join(cwd, config.cacheDir), () => {
    console.log('[ info ] removed all caches');
  });

  const { ufs } = require('unionfs');
  const MemoryFileSystem = require('memory-fs');
  const mfs = new MemoryFileSystem;
  ufs.use(mfs).use(fs);
  mfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

  await bundle(config, ufs, mfs, app);

  if (env === 'development') {
    const escaperegexp = require('lodash.escaperegexp');
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(cwd, {
      ignored: [
        /node_modules/,
        new RegExp(escaperegexp(config.cacheDir)),
      ],
    });

    const closeWatching = () => {
      watcher.close();
    };
    process.on('SIGINT', closeWatching);
    process.on('SIGTERM', closeWatching);
    process.on('exit', closeWatching);

    watcher.on('change', async (p: string) => {
      await fse.remove(path.join(cwd, config.cacheDir));
      await bundle(config, ufs, mfs);
      reloadable.reload();
      console.log('[ info ] reloaded');
    });

    console.log('[ info ] enabled hot reloading');
  }

  gracefullyShutDown(() => {
    console.log('[ info ] gracefully shutting down. please wait...');

    process.on('SIGINT', () => {
      process.exit(0);
    });

    return (server.address() as net.AddressInfo).port;
  });

  return server;
};
