import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path, { sep } from 'path';
import net from 'net';
import http from 'http';
import express from 'express';
import webpack from 'webpack';
import Config from '@react-ssr/core/express/config';
import configure from '@react-ssr/core/webpack/configure';
import {
  getEngine,
  getPages,
  getPageId,
  readFileWithProps,
  gracefullyShutDown,
  sleep,
} from '@react-ssr/core/helpers';

const cwd = process.cwd();
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const ufs = require('unionfs').ufs;
const memfs = new MemoryFileSystem();
ufs.use(fs).use(memfs);

// onchange bundling
async function bundle(config: Config, ufs: any, memfs: any): Promise<void>;

// initial bundling
async function bundle(config: Config, ufs: any, memfs: any, app: express.Application): Promise<void>;

async function bundle(config: Config, ufs: any, memfs: any, app?: express.Application) {
  const entry: webpack.Entry = {};
  const [entryPages, otherPages] = await getPages(config);
  const template = fse.readFileSync(require.resolve('@react-ssr/core/webpack/entry')).toString();

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, config, '/');
    const dir = path.dirname(pageId);
    const name = path.basename(pageId);
    if (dir !== '.') {
      memfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dir}`));
    }
    memfs.writeFileSync(
      path.join(cwd, `react-ssr-src/${path.join(dir, `entry-${name}${ext}`)}`),
      template.replace('__REACT_SSR_PAGE_NAME__', name),
    );
    memfs.writeFileSync(
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
      memfs.mkdirpSync(path.join(cwd, `react-ssr-src/${dir}`));
    }
    memfs.writeFileSync(
      path.join(cwd, `react-ssr-src/${path.join(dir, name + ext)}`),
      fse.readFileSync(page),
    );
  }

  let compiled = false;
  const webpackConfig: webpack.Configuration = configure(entry, config.cacheDir);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.inputFileSystem = ufs;
  compiler.run(async (err: Error) => {
    err && console.error(err.stack || err);

    if (app) {
      for (let i = 0; i < entryPages.length; i++) {
        const page = entryPages[i];
        const pageId = getPageId(page, config, '/');
        const route = `/_react-ssr/${pageId}.js`;

        console.log(`[ info ] optimized "${config.viewsDir}/${pageId}${ext}"`);

        app.get(route, async (req, res) => {
          const props = await codec.decompress(req.query.props);
          if (env === 'development') {
            console.log('[ info ] the props below is rendered from the server side');
            console.log(props);
          }

          const filename = path.join(cwd, config.cacheDir, env, `${getPageId(page, config, '_')}.js`);
          const script = readFileWithProps(filename, props);
          res.type('.js').send(script);
        });
      }
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

export default async (app: express.Application, server: http.Server, config: Config): Promise<http.Server> => {
  let reloadable: any = false;
  if (env === 'development') {
    const reload = require('reload');
    reloadable = await reload(app);
  }

  fse.removeSync(path.join(cwd, config.cacheDir));

  memfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

  await bundle(config, ufs, memfs, app);

  if (env === 'development') {
    const escaperegexp = require('lodash.escaperegexp');
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(cwd, {
      ignored: [
        /node_modules/i,
        /package\.json/i,
        /readme\.md/i,
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
      fse.removeSync(path.join(cwd, config.cacheDir));
      await bundle(config, ufs, memfs);
      reloadable.reload();

      const [, ...rest] = p.replace(cwd, '').split(sep);
      console.log(`[ info ] reloaded (onchange: ${rest.join('/')})`);
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
