const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const user = { name: 'Custom Layout' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
