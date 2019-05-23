const express = require('@react-ssr/express');
const app = express({ views: 'pages' });

app.get('/', (req, res) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(4000, () => {
  console.log('> Ready on http://localhost:4000');
});
