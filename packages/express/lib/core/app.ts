import express from 'express';
import register from './register';
import Config from './config';

function ReactSsrExpress(this: typeof ReactSsrExpress, options?: Config) {
  const app = express();
  this.prototype = app.prototype;
  register(app, Object.assign(new Config, options || {}));
  return app;
};

export default ReactSsrExpress;
