import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import net from 'net';
import http from 'http';
import { NestExpressApplication } from '@nestjs/platform-express';
import webpack from 'webpack';
import {
  configureWebpack,
  getEngine,
  getPages,
  getPageId,
  readFileWithProps,
  gracefullyShutDown,
  sleep,
  Config,
} from '@react-ssr/core';

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
async function bundle(config: Config, ufs: any, memfs: any, app: NestExpressApplication): Promise<void>;

async function bundle(config: Config, ufs: any, memfs: any, app?: NestExpressApplication) {
  const entry: webpack.Entry = {};
  const [entryPages, otherPages] = await getPages();
  const entryPath = path.resolve(require.resolve('@react-ssr/core'), '../webpack/entry.js');
  const template = fse.readFileSync(entryPath).toString();

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '/');
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
    entry[getPageId(page, '_')] = `./react-ssr-src/${path.join(dir, `entry-${name}${ext}`)}`;
  }

  for (let i = 0; i < otherPages.length; i++) {
    const page = otherPages[i];
    const pageId = getPageId(page, '/');
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
  const compiler: webpack.Compiler = webpack(configureWebpack(entry));
  compiler.inputFileSystem = ufs;
  compiler.run(async (err: Error) => {
    err && console.error(err.stack || err);

    if (app) {
      for (let i = 0; i < entryPages.length; i++) {
        const page = entryPages[i];
        const pageId = getPageId(page, '/');
        const route = `/_react-ssr/${pageId}.js`;

        console.log(`[ info ] optimized "${config.viewsDir}/${pageId}${ext}"`);

        app.getHttpAdapter().getInstance().get(route, async (req: any, res: any) => {
          const props = await codec.decompress(req.query.props);
          if (env === 'development') {
            console.log('[ info ] the props below is rendered from the server side');
            console.log(props);
          }

          const filename = path.join(cwd, config.distDir, env, `${getPageId(page, '_')}.js`);
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

export default async (app: NestExpressApplication, server: http.Server, config: Config): Promise<http.Server> => {
  let reloadable: any = false;
  if (env === 'development') {
    const reload = require('reload');
    reloadable = await reload(app.getHttpAdapter().getInstance());
  }

  fse.removeSync(path.join(cwd, config.distDir));

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
        new RegExp(escaperegexp(config.distDir)),
      ],
    });

    const closeWatching = () => {
      watcher.close();
    };
    process.on('SIGINT', closeWatching);
    process.on('SIGTERM', closeWatching);
    process.on('exit', closeWatching);

    watcher.on('change', async (p: string) => {
      fse.removeSync(path.join(cwd, config.distDir));
      await bundle(config, ufs, memfs);
      reloadable.reload();

      const [, ...rest] = p.replace(cwd, '').split(path.sep);
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
