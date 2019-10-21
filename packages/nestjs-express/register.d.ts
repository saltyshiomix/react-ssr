import { NestExpressApplication } from '@nestjs/platform-express';

interface Config {
  viewsDir?: string;
  cacheDir?: string;
}

declare function register(app: NestExpressApplication, config?: Config): Promise<void>;

export = register;
