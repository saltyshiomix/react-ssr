const express = require('express');
const register = require('@react-ssr/express/register');

const app = express();

(async () => {
  await register(app);

  app.get('/', (req, res) => {
    const user = { name: 'World' };
    res.render('index', { user });
  });
  
  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
