import express from 'express';
import register from './register';
import Config from './config';

const ReactSsrExpress = (options?: Config) => {
  const app = express();
  register(app, Object.assign(new Config, options || {}));
  return app;
};

ReactSsrExpress.prototype = express.prototype;

export default ReactSsrExpress;
