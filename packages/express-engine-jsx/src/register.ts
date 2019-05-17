import { remove } from 'fs-extra';
import { resolve } from 'path';
import express, { Application } from 'express';
import { Config } from '@react-ssr/express';
import render from './render';

const register = async (app: Application, config: Config): Promise<void> => {
  require('@babel/register')();

  const ENGINE: string = 'jsx';
  const cwd: string = process.cwd();
  const buildDir: string = config.buildDir as string;
  const viewsDir: string = config.viewsDir as string;

  if (process.env.REACT_SSR === 'BUILD') {
    await remove(buildDir);
  }

  const renderFile = async (file: string, options: any, cb: (err: any, content?: string) => void) => {
    try {
      // HACK: delete unnecessary server options
      const props: any = options;
      delete props.settings;
      delete props._locals;
      delete props.cache;

      return cb(null, await render(file, config, props));

    } catch (e) {
      return cb(e);
    }
  };

  app.engine(ENGINE, renderFile);
  app.set('views', resolve(cwd, viewsDir));
  app.set('view engine', ENGINE);
  app.use(express.static(buildDir));
};

export default register;
