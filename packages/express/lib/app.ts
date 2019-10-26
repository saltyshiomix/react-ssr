import express from 'express';
import register from './register';

function ReactSsrExpress() {
  const app = express();
  register(app);
  return app;
};

export default ReactSsrExpress;
