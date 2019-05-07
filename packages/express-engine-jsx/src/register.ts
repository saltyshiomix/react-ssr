import {
  remove,
  existsSync,
  readFileSync,
} from 'fs-extra';
import { resolve } from 'path';
import express, { Application } from 'express';
import { Config } from '@react-ssr/express';
import { getPagePath } from './utils';
import buildPage from './build-page';

const ENGINE: string = 'jsx';
const cwd: string = process.cwd();

const register = async (app: Application, config: Config): Promise<void> => {
  require('@babel/register')();

  const buildDir: string = config.buildDir as string;
  const viewsDir: string = config.viewsDir as string;

  await remove(buildDir);

  app.engine(ENGINE, async (file: string, options: any, cb: (err: any, content?: string) => void) => {
    try {
      // HACK: delete unnecessary server options
      const props: any = options;
      delete props.settings;
      delete props._locals;
      delete props.cache;

      const pagePath: string = getPagePath(file, config);
      const cache: string = resolve(cwd, buildDir, viewsDir, pagePath.replace('.jsx', '.html'));

      if (existsSync(cache)) {
        return cb(null, readFileSync(cache).toString());
      }

      return cb(null, await buildPage(file, config, props));

    } catch (e) {
      return cb(e);
    }
  });

  app.set('views', resolve(cwd, viewsDir));
  app.set('view engine', ENGINE);

  app.use(express.static(buildDir));
};

export default register;
