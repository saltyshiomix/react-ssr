import express from 'express';

declare function register(app: express.Application): Promise<void>;

export = register;
