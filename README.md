<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR as a view template engine</p>

## Features

- Pass the server data to the client `props`
- Blazing fast SSR (Server Side Rendering)
- Support TypeScript

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

## Configuration

```js
const express = require('@react-ssr/express');

// default configuration
const app = express({
  viewsDir: 'views',
  cacheDir: '.cache',
});
```

## TypeScript Support

To enable TypeScript engine (`.tsx`), just put `tsconfig.json` in your project root directory.

The code of TypeScript will be like this:

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
import {
  Request,
  Response,
} from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  const message = 'Hello World!';
  res.render('index', { message });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.tsx`**

```tsx
import React from 'react';

interface IndexProps {
  message: string;
}

export default function Index({ message }: IndexProps) {
  return <p>{message}</p>;
}
```

## Packages

| package | version |
| --- | --- |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |

## Examples

See the [examples](./examples) folder.

## Develop `examples/<example-folder-name>`

```bash
$ git clone https://github.com/saltyshiomix/react-ssr.git
$ cd react-ssr
$ yarn
$ yarn dev <example-folder-name>
```

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

## Related

[saltyshiomix/react-ssr-starter](https://github.com/saltyshiomix/react-ssr-starter)
