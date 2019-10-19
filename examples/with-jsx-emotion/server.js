const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const title = 'Home Page - @react-ssr/express with Emotion';
  res.render('index', { title });
});

app.get('/next', (req, res) => {
  const title = 'Next Page - @react-ssr/express with Emotion';
  res.render('next', { title });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
