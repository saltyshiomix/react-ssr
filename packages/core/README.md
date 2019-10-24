<p align="center">😎 @react-ssr/core 😎</p>
<p align="center">
  <a href="https://npm.im/@react-ssr/core" alt="A version of @react-ssr/core">
    <img src="https://img.shields.io/npm/v/@react-ssr/core.svg">
  </a>
  <a href="https://npm.im/@react-ssr/core" alt="Downloads of @react-ssr/core">
    <img src="https://img.shields.io/npm/dt/@react-ssr/core.svg">
  </a>
  <img src="https://img.shields.io/npm/l/@react-ssr/core.svg" alt="Package License (MIT)">
</p>

This package is internally used by [@react-ssr/express](https://npm.im/@react-ssr/express) and [@react-ssr/nestjs-express](https://npm.im/@react-ssr/nestjs-express).

## Packages

| package | version |
| --- | --- |
| [@react-ssr/core](https://github.com/saltyshiomix/react-ssr/blob/master/packages/core/README.md) | ![@react-ssr/core](https://img.shields.io/npm/v/@react-ssr/core.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/core.svg) |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |
| [@react-ssr/nestjs-express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/nestjs-express/README.md) | ![@react-ssr/nestjs-express](https://img.shields.io/npm/v/@react-ssr/nestjs-express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/nestjs-express.svg) |

## Examples

- [examples/basic-blogging](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-blogging)
- [examples/basic-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-css)
- [examples/basic-jsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx)
- [examples/basic-nestjs](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs)
- [examples/basic-nestjs-nodemon](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs-nodemon)
- [examples/basic-tsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx)
- [examples/custom-babelrc](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-babelrc)
- [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)
- [examples/custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-views)
- [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
- [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)
- [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

Each example uses `@react-ssr/{express|nestjs-express}@canary` by default, so it may have some bugs.

To use the stable version, please rewrite to `@react-ssr/{express|nestjs-express}@latest`:

```json
{
  "dependencies": {
    "@react-ssr/express": "latest"
  }
}
```

## Features

- Blazing fast SSR (Server Side Rendering)
- Passing the server data to the client `props`
- Dynamic `props` without caring about SSR
  - Suitable for dynamic routes like blogging
- Hot relaoding when `process.env.NODE_ENV !== 'production'`
- TypeScript support

## Usage

Install it:

```bash
$ npm install --save @react-ssr/express react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Populate files below inside your project:

**`./server.js`**

```js
const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const message = 'Hello World!';
  res.render('index', { message });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.jsx`**

```jsx
import React from 'react';

export default function Index({ message }) {
  return <p>{message}</p>;
}
```

and then just run `npm start` and go to `http://localhost:3000`.

You'll see `Hello World!`.

## Rules

- The each view must be a single entry point
  - Don't create other components in the views directory
- The each view's extension must be either `.jsx` or `.tsx`
  - We can decide freely with other components' extension

## Starters

- [react-ssr-starter](https://github.com/saltyshiomix/react-ssr-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)
