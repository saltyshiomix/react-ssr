import express from 'express';

interface Config {
  viewsDir?: string;
  cacheDir?: string;
}


declare function register(app: express.Application, config?: Config): Promise<void>;

export = register;
