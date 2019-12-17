import express from 'express';
import register from './register';
import { staticConfig } from './helpers';

const app = express();

(async () => {
  await register(app);

  const routes = Object.keys(staticConfig.routes);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const view = staticConfig.routes[route];
    app.get(route, (_req: express.Request, res: express.Response) => {
      res.render(view);
    });
  }

  app.listen(staticConfig.port, () => {
    console.log(`> Ready on http://localhost:${staticConfig.port}`);
  });
})();
