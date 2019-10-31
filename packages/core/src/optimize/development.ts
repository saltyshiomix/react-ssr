import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import proxy from 'http-proxy-middleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { configureWebpack } from '../webpack.config';
import { getEntry } from './helpers';
import {
  getSsrConfig,
  getPageId,
  readFileWithProps,
  sleep,
  Config,
} from '../helpers/core';

const cwd = process.cwd();
const config: Config = getSsrConfig();
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

  const devServerPort = 8888;
  const devServer = new WebpackDevServer(compiler, {
    hot: true,
    liveReload: false,
    noInfo: true,
    stats: 'errors-only',
    compress: true,
    after: (app: express.Application, server: WebpackDevServer, compiler: webpack.Compiler) => {
      for (let i = 0; i < entryPages.length; i++) {
        const page = entryPages[i];
        const pageId = getPageId(page, '/');
        const route = `/_react-ssr/${pageId}.js`;
        app.get(route, async (req, res) => {
          const props = await codec.decompress(req.query.props);
          console.log('[ info ] the props below is rendered from the server side');
          console.log(props);
          const filename = path.join(cwd, config.distDir, `${getPageId(page, '_')}.js`);
          const script = readFileWithProps(filename, props, compiler.outputFileSystem);
          res.status(200).type('.js').send(script);
        });
      }
    },
  });

  (async () => {
    devServer.listen(devServerPort);
  })();

  while (true) {
    if (compiled) {
      break;
    }
    await sleep(100);
  }

  const proxyMiddleware = proxy({
    target: `http://localhost:${devServerPort}`,
    ws: true,
    changeOrigin: true,
    logLevel: 'error',
  });

  app.use('/sockjs-node*', proxyMiddleware);

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '/');
    const route = `/_react-ssr/${pageId}.js`;
    app.use(route, proxyMiddleware);
  }
};
