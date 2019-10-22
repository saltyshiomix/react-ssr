import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import renderFile from './render';
import optimize from './optimize';
import Config from './config';
import { getEngine } from './utils';

const register = async (app: NestExpressApplication, overrideConfig?: Config): Promise<void> => {
  const config: Config = Object.assign(new Config, overrideConfig || {});
  const engine: 'jsx' | 'tsx' = getEngine();

  const expressApp = app.getHttpAdapter().getInstance()
  expressApp.engine(engine, renderFile)
  expressApp.set('views', path.join(process.cwd(), config.viewsDir));
  expressApp.set('view engine', engine);

  await optimize(app, app.getHttpServer(), config);
};

export default register;
