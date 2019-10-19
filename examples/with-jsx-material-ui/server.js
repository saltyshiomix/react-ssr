const express = require('@react-ssr/express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  const user = { name: 'Material UI' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
