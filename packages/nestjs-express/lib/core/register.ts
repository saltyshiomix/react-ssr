import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import render from './render';
import optimize from './optimize';
import Config from './config';
import { getEngine } from './utils';

const escaperegexp = require('lodash.escaperegexp');

let moduleDetectRegEx: RegExp;

const register = async (app: NestExpressApplication, overrideConfig?: Config): Promise<void> => {
  const config: Config = Object.assign(new Config, overrideConfig || {});

  const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
    if (!moduleDetectRegEx) {
      const pattern = [].concat(options.settings.views).map(viewPath => '^' + escaperegexp(viewPath)).join('|');
      moduleDetectRegEx = new RegExp(pattern);
    }
  
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
  const expressApp = app.getHttpAdapter().getInstance()
  expressApp.engine(engine, renderFile)
  expressApp.set('views', path.join(process.cwd(), config.viewsDir));
  expressApp.set('view engine', engine);

  await optimize(app, app.getHttpServer(), config);
};

export default register;
