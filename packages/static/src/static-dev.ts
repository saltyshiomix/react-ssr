import express from 'express';
import register from './register';
import { getStaticConfig } from './helpers';

const app = express();
const config = getStaticConfig();

(async () => {
  await register(app);

  const routes = Object.keys(config.routes);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const view = config.routes[route];
    app.get(route, (_req: express.Request, res: express.Response) => {
      res.render(view);
    });
  }

  app.listen(config.port, () => {
    console.log(`> Ready on http://localhost:${config.port}`);
  });
})();
