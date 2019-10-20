import express from 'express';
import Config from './lib/core/config';

declare function register(app: express.Application, config?: Config): Promise<void>;

export = register;
