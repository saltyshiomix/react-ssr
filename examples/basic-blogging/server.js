const express = require('express');
const register = require('@react-ssr/express/register');

const app = express();

(async () => {
  await register(app);

  const posts = [
    {
      id: 1,
      title: 'This is a first post',
      body: `Hello
World!
("id": 1)`
    },
    {
      id: 2,
      title: 'This is a second post',
      body: `Hello
World!
("id": 2)`
    },
    {
      id: 3,
      title: 'This is a last post',
      body: `Hello
World!
("id": 3)`
    },
  ];

  const findById = (id) => {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (post.id === parseInt(id, 10)) {
        return post;
      }
    }
    return undefined;
  };

  app.get('/', (req, res) => {
    res.render('index', { posts });
  });

  app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params;
    const post = findById(postId);
    res.render('posts', { post });
  });

  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
