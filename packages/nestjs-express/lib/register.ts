import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  render,
  clearCache,
  getEngine,
  getSsrConfig,
} from '@react-ssr/core';
import optimize from './optimize';

const escaperegexp = require('lodash.escaperegexp');

let moduleDetectRegEx: RegExp;

const register = async (app: NestExpressApplication): Promise<void> => {
  await clearCache();

  const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
    const { settings, cache, _locals, ...props } = options;
    if (!moduleDetectRegEx) {
      const pattern = [].concat(settings.views).map(viewPath => '^' + escaperegexp(viewPath)).join('|');
      moduleDetectRegEx = new RegExp(pattern);
    }
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

  const config = getSsrConfig();
  const engine: 'jsx' | 'tsx' = getEngine();
  const expressApp = app.getHttpAdapter().getInstance()
  expressApp.engine(engine, renderFile)
  expressApp.set('views', path.join(process.cwd(), config.viewsDir));
  expressApp.set('view engine', engine);

  await optimize(app, app.getHttpServer(), config);
};

export default register;
