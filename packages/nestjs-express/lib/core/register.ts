import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import render from './render';
import optimize from './optimize';
import Config from './config';
import {
  getBabelrc,
  getEngine,
} from './utils';

const escaperegexp = require('lodash.escaperegexp');

const register = async (app: NestExpressApplication, overrideConfig?: Config): Promise<void> => {
  require('@babel/register')({
    extends: getBabelrc(),
  });

  const config: Config = Object.assign(new Config, overrideConfig || {});

  // let babelRegistered = false;
  let moduleDetectRegEx: RegExp;

  const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
    if (!moduleDetectRegEx) {
      const pattern = [].concat(options.settings.views).map(viewPath => '^' + escaperegexp(viewPath)).join('|');
      moduleDetectRegEx = new RegExp(pattern);
    }

    // if (!babelRegistered) {
    //   require('@babel/register')({
    //     extends: getBabelrc(),
    //   });
    //   babelRegistered = true;
    // }

    const { settings, cache, _locals, ...props } = options;

    try {
      return cb(undefined, await render(file, props, config));
    } catch (e) {
      return cb(e);
    } finally {
      Object.keys(require.cache).forEach((filename) => {
        if (moduleDetectRegEx.test(filename)) {
          delete require.cache[filename];
        }
      });
    }
  };

  const engine: 'jsx' | 'tsx' = getEngine();

  app.engine(engine, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', engine);

  app.listen = function() {
    const args: any = arguments;
    const server = app.getHttpServer();
    optimize(app, server, config).then((server) => {
      server.listen.apply(server, args);
    });
    return server;
  };
};

export default register;
