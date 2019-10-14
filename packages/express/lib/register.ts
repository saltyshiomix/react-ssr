import path from 'path';
import http from 'http';
import express from 'express';
import render from './render';
import optimize from './optimize';
import Config from './config';
import {
  getBabelrc,
  getEngine,
  gracefullyShutDown,
} from './utils';

const _escaperegexp = require('lodash.escaperegexp');

const register = async (app: express.Application, config: Config): Promise<void> => {
  let babelRegistered = false;
  let moduleDetectRegEx: RegExp;

  const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
    if (!moduleDetectRegEx) {
      moduleDetectRegEx = new RegExp([].concat(options.settings.views).map(viewPath => '^' + _escaperegexp(viewPath)).join('|'));
    }

    if (!babelRegistered) {
      require('@babel/register')({
        extends: getBabelrc(),
        only: [].concat(options.settings.views),
      });
      babelRegistered = true;
    }

    try {
      const { settings, cache, _locals, ...props } = options;
      return cb(undefined, await render(file, props));
    } catch (e) {
      return cb(e);
    } finally {
      console.log('ENV (options.settings.env): ' + options.settings.env);
      console.log(options.settings);

      if (options.settings.env === 'development') {
        Object.keys(require.cache).forEach((filename) => {
          console.log('filename: ' + filename);

          if (moduleDetectRegEx.test(filename)) {
            delete require.cache[filename];
            console.log('[ debug ] deleted cache: ' + filename);
          }
        });
      }
    }
  };

  const engine: 'jsx' | 'tsx' = getEngine();

  app.engine(engine, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', engine);

  app.listen = function() {
    const args: any = arguments;
    const server = http.createServer(app);
    optimize(app, config).then(() => {
      server.listen.apply(server, args)
    });
    return server;
  };

  gracefullyShutDown(() => {
    console.log('[ info ] gracefully shutting down. Please wait...');
    process.on('SIGINT', () => {
      console.log('[ warn ] force-closing all open sockets...');
      process.exit(0);
    });
  });
};

export default register;
