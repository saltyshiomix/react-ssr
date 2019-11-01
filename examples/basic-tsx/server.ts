import express, { Request, Response } from 'express';
import register from '@react-ssr/express/register';

const app = express();

(async () => {
  await register(app);

  app.get('/', (_req: Request, res: Response) => {
    const user = { name: 'World' };
    res.render('index', { user });
  });
  
  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
