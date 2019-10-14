import path from 'path';
import http from 'http';
import express from 'express';
import render from './render';
import optimize from './optimize';
import Config from './config';
import {
  getBabelrc,
  getEngine,
} from './utils';

require('@babel/register')({ extends: getBabelrc() });

const register = async (app: express.Application, config: Config): Promise<void> => {
  const ENGINE: 'jsx' | 'tsx' = getEngine();

  const renderFile = async (file: string, options: any, cb: any) => {
    try {
      const { settings, cache, _locals, ...props } = options;
      return cb(null, await render(file, props));
    } catch (e) {
      return cb(e);
    }
  };

  app.engine(ENGINE, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', ENGINE);

  app.listen = function() {
    optimize(app, config);
    const server = http.createServer(app);
    return server.listen.apply(server, arguments as any);
  };
};

export default register;
