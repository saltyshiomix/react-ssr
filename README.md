<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR as a view template engine</p>

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
- With a Layout component (explain it later), we must specify `data-ssr-id`
  - e.g. `<body data-ssr-id='emotion'>`

## Configuration

### Constructor Configuration

```js
const express = require('@react-ssr/express');

// default configuration
const app = express({
  viewsDir: 'views',
  cacheDir: '.cache',
});
```

### `ssr.config.js`

WIP

## Custom Layout

In the layout, we must inject `@react-ssr/express/script` in the body tag:

**./components/layout.jsx**

```jsx
import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const {
    children,
    script, // script source: passed from the server
  } = props;

  return (
    <html>
      <head>
        <title>Hello Layout</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

And then, just use it like before:

**./views/index.jsx**

```jsx
import React from 'react';
import { Layout } from '../components/layout';

const Index = (props) => {
  const {
    script, // injected by @react-ssr/express
  } = props;

  return (
    <Layout
      script={script} // pass it to the layout component for the dynamic SSR
    >
      <p>Hello Layout!</p>
    </Layout>
  );
};

export default Index;
```

A working example is here: [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)

## `data-ssr-id`

If we use the SSR supported UI framework, we must specify `data-ssr-id` in the body tag.

(Without the layout, we don't need to specify `data-ssr-id`.)

**./components/layout.jsx** ([emotion](https://emotion.sh) example)

```jsx
import ReactSsrScript from '@react-ssr/express/script';
import { css, Global } from '@emotion/core';

export const Layout = (props) => {
  const {
    children,
    script,
  } = props;

  return (
    <html>
      <head>
        <title>Hello Emotion</title>
      </head>
      <Global
        styles={css`
          html, body {
            margin: 0;
            padding: 0;
          }
        `}
      />
      <body data-ssr-id='emotion'>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

### WIP: Supported `data-ssr-id`

- [x] [emotion](https://emotion.sh)
- [ ] [styled-components](https://www.styled-components.com)
- [ ] [material-ui](https://material-ui.com)
- [ ] [antd](https://ant.design)
- [ ] and more...

#### With Emotion

In order to enable SSR, we must install these dependencies:

- `babel-plugin-emotion`
- `emotion`
- `emotion-server`

A minimal `package.json` is like this:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@emotion/core": "latest",
    "@emotion/styled": "latest",
    "@react-ssr/express": "latest",
    "babel-plugin-emotion": "latest",
    "emotion": "latest",
    "emotion-server": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/express/babel"
  ],
  "plugins": [
    "emotion"
  ]
}
```

Finally, if we use custom layout, specify `data-ssr-id` in the body tag:

```jsx
import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const { script } = props;

  return (
    <html>
      <head>
        <title>Hello Emotion</title>
      </head>
      <body data-ssr-id='emotion'>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
```

#### With styled-components

WIP

#### With Material UI

WIP

#### With Ant Design

WIP

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
import express, { Request, Response } from '@react-ssr/express';

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

Each example uses `@react-ssr/express@canary` by default, so it may have some bugs.

To use the stable version, please rewrite to `@react-ssr/express@latest`:

```json
{
  "dependencies": {
    "@react-ssr/express": "latest"
  }
}
```

## Develop `examples/<example-folder-name>`

```bash
$ git clone https://github.com/saltyshiomix/react-ssr.git
$ cd react-ssr
$ yarn
$ yarn dev <example-folder-name>
```

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## How it works

WIP

## Related

[saltyshiomix/react-ssr-starter](https://github.com/saltyshiomix/react-ssr-starter)

[reactjs/express-react-views](https://github.com/reactjs/express-react-views)
