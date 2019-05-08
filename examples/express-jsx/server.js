const { ReactSsrExpress } = require('@react-ssr/express');

const ssr = new ReactSsrExpress;
const app = ssr.getApp();

app.get('/', (req, res) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(4000, () => {
  console.log('> Ready on http://localhost:4000');
});
