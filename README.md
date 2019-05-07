<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR with ease</p>

## How to use

Install it:

```bash
$ npm install --save @react-ssr/express @react-ssr/express-engine-jsx express react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Populate below files inside your project:

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

**`./views/index.jsx`**

```jsx
import React from 'react';

export default class extends React.Component {
  render() {
    return `Hello ${this.props.user.name}!`;
  }
}
```

and then just run `npm start` and go to `http://localhost:3000`.

You'll see `Hello World!`.

## Features

- Pass server data to the client `this.props`
- Server Side Rendering

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
