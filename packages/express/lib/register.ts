import { join } from 'path';
import express, { Application } from 'express';
import render from './render';
import { Config } from './config';
import {
  getBabelrc,
  getEngine,
} from './utils';

require('@babel/register')({ extends: getBabelrc() });

const cwd: string = process.cwd();

const register = async (app: Application, config: Config): Promise<void> => {
  const env: string = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const distDir: string = config.distDir || '';
  const viewsDir: string = config.viewsDir || '';

  const renderFile = async (file: string, options: any, cb: any) => {
    try {
      // HACK: delete unnecessary server options
      const { settings, cache, _locals, ...props } = options;
      return cb(null, await render(file, config, props));
    } catch (e) {
      return cb(e);
    }
  };

  const ENGINE: 'jsx' | 'tsx' = getEngine();
  app.engine(ENGINE, renderFile);
  app.set('views', join(cwd, viewsDir));
  app.set('view engine', ENGINE);
  app.use(express.static(join(cwd, distDir, env)));
};

export default register;
