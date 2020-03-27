const express = require('express');
const register = require('@react-ssr/express/register');

const app = express();

(async () => {
  // register `.jsx`
  await register(app);

  // register `.hbs`
  app.set('view engine', 'hbs');

  app.get('/', (req, res) => {
    const message = 'Home Page';
    res.render('index.jsx', { message });
  });

  app.get('/about', (req, res) => {
    const message = 'About Page';
    res.render('about.hbs', { message });
  });

  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
