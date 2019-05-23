<p align="center">😎 @react-ssr/express 😎</p>
<p align="center">
  <a href="https://npm.im/@react-ssr/express" alt="A version of @react-ssr/express">
    <img src="https://img.shields.io/npm/v/@react-ssr/express.svg">
  </a>
  <a href="https://npm.im/@react-ssr/express" alt="Downloads of @react-ssr/express">
    <img src="https://img.shields.io/npm/dt/@react-ssr/express.svg">
  </a>
</p>

## How to use

Install it:

```bash
$ npm install --save @react-ssr/express express react react-dom
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

**`./server.js`**

```js
const express = require('@react-ssr/express');
const app = express();

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

## Configuration

```js
const express = require('@react-ssr/express');

// default configuration
const app = express({
  engine: 'jsx', // or 'tsx'
  distDir: 'dist',
  viewsDir: 'views',
});
```

## TypeScript Support

**`./package.json`**

```json
{
  "scripts": {
    "start": "ts-node server.ts"
  }
}
```

**`./server.ts`**

```ts
import express from '@react-ssr/express';
import { Request, Response } from 'express';

const app = express({ engine: 'tsx' });

app.get('/', (_req: Request, res: Response) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.tsx`**

```tsx
import React from 'react';

interface Props {
  user: any;
}

export default class extends React.Component<Props> {
  render() {
    return `Hello ${this.props.user.name}!`;
  }
}
```
