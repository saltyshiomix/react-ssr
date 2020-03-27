import express from 'express';
import register from '@react-ssr/express/register';

const app = express();

const todos = [
  { id: 1, text: 'Hello World', completed: true },
  { id: 2, text: 'This is a react-ssr with Redux', completed: false },
];

(async () => {
  await register(app);

  app.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', {
      todos,
    });
  });

  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
