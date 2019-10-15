import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import net from 'net';
import http from 'http';
import express from 'express';
import hasha from 'hasha';
import readdir from 'recursive-readdir';
import webpack from 'webpack';
import configure from './webpack.config';
import Config from './config';
import {
  getEngine,
  gracefullyShutDown,
} from './utils';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const cwd = process.cwd();
const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ignores = [
  '.*',
  '*.json',
  '*.lock',
  'LICENSE',
];

const ignoreDotDir = (file: string, stats: fse.Stats) => {
  return stats.isDirectory() && path.basename(file).startsWith('.');
};

const ignoreNodeModules = (file: string, stats: fse.Stats) => {
  return stats.isDirectory() && path.basename(file) == 'node_modules';
};

const getPages = async (config: Config): Promise<string[][]> => {
  const allPages = await readdir(cwd, [ignoreNodeModules, ignoreDotDir, ...ignores]);
  const entryPages = await readdir(path.join(cwd, config.viewsDir), [ignoreDotDir, ...ignores]);
  const otherPages = [];
  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i];
    if (entryPages.includes(p)) {
      continue;
    }
    otherPages.push(p);
  }
  return [entryPages, otherPages];
};

const getRelativeInfo = (file: string): string[] => {
  const splitted = file.replace(cwd, '').split(path.sep);
  const [, ...rest] = splitted;
  const relativeFile = rest.join(path.sep);
  const relativeDir = path.dirname(relativeFile);

  console.log([relativeFile, relativeDir]);

  return [relativeFile, relativeDir];
};

const waitUntilCompleted = async (mfs: any, filename: string) => {
  const existsInMFS = mfs.existsSync(filename);
  let existsInFS = fse.existsSync(filename);
  if (existsInMFS && existsInFS) {
    return;
  }
  if (existsInMFS) {
    fse.outputFileSync(filename, mfs.readFileSync(filename).toString());
  }
  await sleep(50);
  waitUntilCompleted(mfs, filename);
}

// onchange bundling
async function bundle(config: Config, ufs: any, mfs: any): Promise<void>;

// initial bundling
async function bundle(config: Config, ufs: any, mfs: any, app: express.Application): Promise<void>;

async function bundle(config: Config, ufs: any, mfs: any, app?: express.Application) {
  const entry: webpack.Entry = {};
  const [entryPages, otherPages] = await getPages(config);
  const template = fse.readFileSync(path.join(__dirname, '../entry.jsx'))
                      .toString()
                      .replace(
                        '\'__REACT_SSR_DEVELOPMENT__\'',
                        env === 'development' ? 'true' : 'false',
                      );

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const hash = hasha(env + page, { algorithm: 'md5' });
    const [filename, dirname] = getRelativeInfo(page);
    mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dirname}`));
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/${dirname}/entry-${path.basename(filename)}`), template);
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/${filename}`), fse.readFileSync(page));
    entry[hash] = `react-ssr-src/${dirname}/entry-${path.basename(filename)}`;
  }

  for (let i = 0; i < otherPages.length; i++) {
    const page = otherPages[i];
    const [filename, dirname] = getRelativeInfo(page);
    mfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dirname}`));
    mfs.writeFileSync(path.join(cwd, `react-ssr-src/${filename}`), fse.readFileSync(page));
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
      const hash = hasha(env + page, { algorithm: 'md5' });
      const filename = path.join(cwd, config.cacheDir, env, `${hash}.js`);
  
      await waitUntilCompleted(mfs, filename);
  
      const [, ...rest] = page.replace(cwd, '').split(path.sep);
      const id = rest.join('/');
      const route = '/_react-ssr/' + id.replace(ext, '.js');
  
      console.log(`  [ ok ] optimized "${id}"`);
  
      app.get(route, async (req, res) => {
        const props = await codec.decompress(req.query.props);
        if (env === 'development') {
          console.log('[ info ] the props below is rendered from the server side');
          console.log(props);
        }
  
        const swichableFS = env === 'development' ? mfs : fse;
        const script = swichableFS.readFileSync(filename)
                                  .toString()
                                  .replace(
                                    '__REACT_SSR__',
                                    JSON.stringify(props).replace(/"/g, '\\"'),
                                  );
  
        res.type('.js');
        res.send(script);
      });
    }
  } else {
    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const hash = hasha(env + page, { algorithm: 'md5' });
      const filename = path.join(cwd, config.cacheDir, env, `${hash}.js`);
      await waitUntilCompleted(mfs, filename);
    }
  }

  // wait until bundled files are ready
  await sleep(1500);
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

  console.log('[ info ] optimizing for the performance...');

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
    console.log('[ info ] gracefully shutting down. Please wait...');

    process.on('SIGINT', () => {
      process.exit(0);
    });

    const address = server.address() as net.AddressInfo;
    return address.port;
  });

  return server;
};
