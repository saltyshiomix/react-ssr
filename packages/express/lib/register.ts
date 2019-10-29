import path from 'path';
import http from 'http';
import express from 'express';
import {
  render,
  clearCache,
  getSsrConfig,
  getEngine,
  Config,
} from '@react-ssr/core';
import optimize from './optimize';

const escaperegexp = require('lodash.escaperegexp');

let moduleDetectRegEx: RegExp;

const register = async (app: express.Application): Promise<void> => {
  // await clearCache();

  const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
    if (!moduleDetectRegEx) {
      const pattern = [].concat(options.settings.views).map(viewPath => '^' + escaperegexp(viewPath)).join('|');
      moduleDetectRegEx = new RegExp(pattern);
    }

    const { settings, cache, _locals, ...props } = options;
    try {
      return cb(undefined, await render(file, props));
    } catch (e) {
      return cb(e);
    } finally {
      if (process.env.NODE_ENV !== 'production') {
        Object.keys(require.cache).forEach((filename) => {
          if (moduleDetectRegEx.test(filename)) {
            delete require.cache[filename];
          }
        });
      }
    }
  };

  const config: Config = getSsrConfig();
  const engine: 'jsx' | 'tsx' = getEngine();
  app.engine(engine, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', engine);

  app.listen = function() {
    const args: any = arguments;
    const server = http.createServer(app);
    optimize(app, server).then((server) => {
      server.listen.apply(server, args);
    });
    return server;
  };
};

export default register;
