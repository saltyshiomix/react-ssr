import express from 'express';
import register from './register';
import Config from './config';

function ReactSsrExpress(options?: Config) {
  const app = express();
  register(app, Object.assign(new Config, options || {}));
  return app;
};

export default ReactSsrExpress;
