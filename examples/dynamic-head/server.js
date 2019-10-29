const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const user = { name: 'Dynamic Head' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
