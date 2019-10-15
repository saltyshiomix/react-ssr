const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const title = '@react-ssr/express with Emotion';
  res.render('index', { title });
});

app.get('/next', (req, res) => {
  const title = '@react-ssr/express with Emotion';
  res.render('next', { title });
});

app.listen(4000, () => {
  console.log('> Ready on http://localhost:4000');
});
