import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import proxy from 'http-proxy-middleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
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

  const devServerPort = 8888;
  const devServer = new WebpackDevServer(compiler, {
    hot: true,
    noInfo: true,
    stats: 'errors-only',
    overlay: true,
    compress: true,
    serveIndex: false,
    after: (app: express.Application, server: WebpackDevServer, compiler: webpack.Compiler) => {
      const memfs = compiler.outputFileSystem as any;

      for (let i = 0; i < entryPages.length; i++) {
        const page = entryPages[i];
        const pageId = getPageId(page, '_');

        app.get(`/_react-ssr/${pageId}.css`, (req, res) => {
          const filename = path.join(cwd, config.distDir, `${pageId}.css`);
          const style = memfs.existsSync(filename) ? memfs.readFileSync(filename).toString() : '';
          res.writeHead(200, { 'Content-Type': 'text/css' });
          res.end(style, 'utf-8');
        });

        app.get(`/_react-ssr/${pageId}.js`, (req, res) => {
          const filename = path.join(cwd, config.distDir, `${pageId}.js`);
          const script = memfs.readFileSync(filename).toString();
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

  const defaultProxyConfig = {
    target: `http://localhost:${devServerPort}`,
    ws: true,
    changeOrigin: true,
    logLevel: 'error',
  } as proxy.Config

  const proxyConfig = config.proxyMiddleware
    ? config.proxyMiddleware(defaultProxyConfig)
    : defaultProxyConfig

  const proxyMiddleware = proxy(proxyConfig);

  app.use('/sockjs-node*', proxyMiddleware);

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '_');
    app.use(`/_react-ssr/${pageId}.css`, proxyMiddleware);
  }

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '_');
    app.use(`/_react-ssr/${pageId}.js`, proxyMiddleware);
  }
};
