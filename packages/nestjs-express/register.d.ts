import { NestExpressApplication } from '@nestjs/platform-express';

declare function register(app: NestExpressApplication): Promise<void>;

export = register;
