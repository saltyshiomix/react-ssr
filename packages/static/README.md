## Overview

- Static site generator by using React SSR (Server Side Rendering)
- Developer Experience
  - Dynamic `Head` component for better SEO
  - HMR (Hot Module Replacement) when `process.env.NODE_ENV !== 'production'`
  - Automatically reflect to the browser as soon as you save the scripts and even if styles

## Usage

Install it:

```bash
$ npm install --save @react-ssr/static react react-dom
```

And add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "static",
    "build": "static build"
  }
}
```

Then, populate files below inside your project:

**`.babelrc`**:

```json
{
  "presets": [
    "@react-ssr/static/babel"
  ]
}
```

**`static.config.js`**:

```js
module.exports = {
  routes: {
    '/': 'index',
  },
};
```

**`views/index.jsx`**:

```jsx
export default function Index() {
  return <p>Hello Static Site</p>;
}
```

Finally,

- run `npm run dev` and you'll see `Hello Static Site` in your browser.
- run `npm run build` and you'll see the static files in the dist directory.

A working examples are here:

- [examples/basic-jsx-static](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx-static)
- [examples/basic-tsx-static](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx-static)
- [examples/with-jsx-static-bulma](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-static-bulma)

## Configuration (`static.config.js`)

Here is the default `static.config.js`, which is used by `react-ssr` when there are no valid values:

```js
module.exports = {
  id: 'default',
  distDir: 'dist',
  viewsDir: 'views',
  port: 3000,
  routes: {},
  publicPaths: [],
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    return config;
  },
};
```

### `static.config.js#id`

The id of **UI framework**. (default: `default`)

It can be ignored only when the project does not use any UI frameworks.

Supported UI frameworks are:

- [x] default (the id `default` doesn't need to be specified in `static.config.js`)
  - [x] [bulma](https://bulma.io)
  - [x] [semantic-ui](https://react.semantic-ui.com)
  - [x] Or any other **non** CSS-in-JS UI frameworks
- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [x] [antd](https://ant.design)
- [ ] and more...

For example, if we want to use `emotion`, `static.config.js` is like this:

```js
module.exports = {
  id: 'emotion',
};
```

### `static.config.js#distDir`

The place where `react-ssr` generates static files. (default: `dist`)

### `static.config.js#viewsDir`

The place where we put views. (default: `views`)

### `static.config.js#port`

The port of the development server.

### `static.config.js#routes`

The key is the route, and the value is the path from the views directory.

```js
module.exports = {
  routes: {
    '/': 'index',
    '/profile': 'profile',
    '/login': 'auth/login',
  },
};
```

### `static.config.js#publicPaths`

The place where we put static files like images.

```js
module.exports = {
  publicPaths: [
    'public',
  ],
};
```

### `static.config.js#webpack()`

```js
module.exports = {
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    // we can override default webpack config here
    return config;
  },
};
```

## Custom Document

Just put `_document.jsx` or `_document.tsx` into the views root:

**`views/_document.jsx`**:

```jsx
import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/static';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>Default Title</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
```

**Note**:

- **Please put `<Main />` component directly under `<body>` tag and don't wrap `<Main />` component with another components**, because this is a hydration target for the client.

And then, use it as always:

**`views/index.jsx`**:

```jsx
const Index = () => {
  return <p>Hello Layout!</p>;
};

export default Index;
```

A working example is here: [examples/custom-document](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-document)

## Dynamic `Head`

We can use the `Head` component in any pages:

**`views/index.jsx`**:

```jsx
import React from 'react';
import { Head } from '@react-ssr/static';

const Index = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>Dynamic Title</title>
        <meta name="description" content="Dynamic Description" />
      </Head>
      <p>Of course, SSR Ready!</p>
    </React.Fragment>
  );
};

export default Index;
```

A working example is here: [examples/basic-dynamic-head](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-dynamic-head)

## Supported UI Framework

- [x] default (the id `default` doesn't need to be specified in `static.config.js`)
  - [x] [bulma](https://bulma.io)
  - [x] [semantic-ui](https://react.semantic-ui.com)
  - [x] Or any other **non** CSS-in-JS UI frameworks
- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [x] [antd](https://ant.design)
- [ ] and more...

### Non CSS-in-JS framework

<p align="center"><img src="https://i.imgur.com/0PwlfVk.png"></p>

Like [semantic-ui](https://react.semantic-ui.com), non CSS-in-JS frameworks are supported without extra configuration.

All we have to do is to load global CSS in `_document` or each page:

**`views/_document.jsx`**:

```jsx
import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/static';

export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>A Sample of Semantic UI React</title>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
}
```

### With Ant Design

<p align="center"><img src="https://i.imgur.com/yWGxseM.png"></p>

In order to enable SSR, we must install `babel-plugin-import` as devDependencies.

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/static/babel"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "style": "css"
      }
    ]
  ]
}
```

A working example is here: [examples/with-jsx-antd](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-antd)

### With Emotion

<p align="center"><img src="https://i.imgur.com/XN8evEM.png"></p>

In order to enable SSR, we must install these packages:

- [@emotion/cache](https://npm.im/@emotion/cache) as **dependencies**
- [create-emotion-server](https://npm.im/create-emotion-server) as **dependencies**
- [babel-plugin-emotion](https://npm.im/babel-plugin-emotion) as devDependencies

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/static/babel"
  ],
  "plugins": [
    "emotion"
  ]
}
```

A working example is here: [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)

### With Material UI

<p align="center"><img src="https://i.imgur.com/o1AWdyd.png"></p>

We can use [material-ui](https://material-ui.com) without extra configuration.

A working example is here: [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)

### With styled-components

<p align="center"><img src="https://i.imgur.com/RtuijYA.png"></p>

In order to enable SSR, we must install `babel-plugin-styled-components` as devDependencies.

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/static/babel"
  ],
  "plugins": [
    "styled-components"
  ]
}
```

A working example is here: [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

## TypeScript Support

To enable TypeScript engine (`.tsx`), just put `tsconfig.json` in your project root directory.

## Examples

- **@react-ssr/express**
  - `.jsx`
    - [examples/basic-jsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx)
    - [examples/custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-views)
    - [examples/custom-document](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-document)
    - [examples/basic-dynamic-head](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-dynamic-head)
    - [examples/basic-hmr-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-hmr-css)
    - [examples/basic-hmr-scss](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-hmr-scss)
    - [examples/basic-blogging](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-blogging)
    - [examples/with-jsx-antd](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-antd)
    - [examples/with-jsx-bulma](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-bulma)
    - [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
    - [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)
    - [examples/with-jsx-semantic-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-semantic-ui)
    - [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)
  - `.tsx`
    - [examples/basic-tsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx)
- **@react-ssr/nestjs-express**
  - [examples/basic-nestjs](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs)
  - [examples/basic-nestjs-nodemon](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs-nodemon)
- **@react-ssr/static**
  - `.jsx`
    - [examples/basic-jsx-static](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx-static)
    - [examples/with-jsx-static-bulma](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-static-bulma)
  - `.tsx`
    - [examples/basic-tsx-static](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx-static)

## Starters

- [react-ssr-jsx-starter](https://github.com/saltyshiomix/react-ssr-jsx-starter)
- [react-ssr-tsx-starter](https://github.com/saltyshiomix/react-ssr-tsx-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Articles

[Introducing an Alternative to NEXT.js](https://dev.to/saltyshiomix/introducing-an-alternative-to-next-js-12ph)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## Related

[reactjs/express-react-views](https://github.com/reactjs/express-react-views)
