import express from 'express';
import register from './register';
import Config from './config';

function ReactSsrExpress(config?: Config) {
  const app = express();
  register(app, config);
  return app;
};

export default ReactSsrExpress;
