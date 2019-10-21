import express from 'express';
import Config from '@react-ssr/core/express/config';
import register from './register';

function ReactSsrExpress(config?: Config) {
  const app = express();
  register(app, config);
  return app;
};

export default ReactSsrExpress;
