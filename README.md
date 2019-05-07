<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR with ease</p>

## How to use

Install it:

```bash
$ npm install --save @react-ssr/express @react-ssr/express-engine-jsx express react react-dom
```

and populate files below:

**`./.babelrc`**

```json
{
  "presets": [
    "@react-ssr/express-engine-jsx/babel"
  ]
}
```

**`./server.js`**

```js
const { ReactSsrExpress } = require('@react-ssr/express');

const ssr = new ReactSsrExpress;
const app = ssr.getApp();

app.get('/', (req, res) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.react.jsx`**

```jsx
export default () => 'Hello {{user.name}}!';
```

And you'll see `Hello World!` in `http://localhost:3000`.

## Packages

| package | version | description |
| --- | --- | --- |
| [@react-ssr/express](https://www.npmjs.com/package/@react-ssr/express) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) | express package |
| [@react-ssr/express-engine-jsx](https://www.npmjs.com/package/@react-ssr/express-engine-jsx) | ![@react-ssr/express-engine-jsx](https://img.shields.io/npm/v/@react-ssr/express-engine-jsx.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express-engine-jsx.svg) | express engine (jsx) |

## Contributing

WIP.

## Roadmaps

- [ ] README
  - [x] Roadmaps
  - [x] How to use
  - [ ] Contributing guilds
- [ ] develop packages
  - [x] lerna monorepo development
  - [ ] @react-ssr/express
  - [ ] @react-ssr/express-engine-jsx
  - [ ] @react-ssr/express-engine-tsx
