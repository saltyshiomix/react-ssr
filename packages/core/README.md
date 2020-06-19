This package is internally used by [@react-ssr/express](https://npm.im/@react-ssr/express) and [@react-ssr/nestjs-express](https://npm.im/@react-ssr/nestjs-express).

## Overview

- SSR (Server Side Rendering) as a view template engine
- Dynamic `props`
  - Passing the server data to the React client `props`
  - Suitable for:
    - Admin Panels
    - Blogging
- Developer Experience
  - Zero config of webpack and babel
  - HMR (Hot Module Replacement) both scripts and even if styles when `process.env.NODE_ENV !== 'production'`
  - Built-in Sass (SCSS) support

## Pros and Cons

### Pros

Because it is just a view template engine:

- It doesn't need to have any APIs, all we have to do is to pass the server data to the client
- It supports multiple engines like `.hbs`, `.ejs` and React `.(ts|js)x`
- We can use [passport](http://www.passportjs.org) authentication as it always is

### Cons

- It is not so performant, because it assembles the whole HTML on each request
- It does not support **client side routing**

## Packages

| package | version |
| --- | --- |
| [@react-ssr/core](https://github.com/saltyshiomix/react-ssr/blob/master/packages/core/README.md) | ![@react-ssr/core](https://img.shields.io/npm/v/@react-ssr/core.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/core.svg) |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |
| [@react-ssr/nestjs-express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/nestjs-express/README.md) | ![@react-ssr/nestjs-express](https://img.shields.io/npm/v/@react-ssr/nestjs-express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/nestjs-express.svg) |

## Usage

### With @react-ssr/express

Install it:

```bash
$ npm install --save @react-ssr/core @react-ssr/express express react react-dom
```

And add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Then, populate files below inside your project:

**`server.js`**:

```js
const express = require('express');
const register = require('@react-ssr/express/register');

const app = express();

(async () => {
  // register `.jsx` or `.tsx` as a view template engine
  await register(app);

  app.get('/', (req, res) => {
    const message = 'Hello World!';
    res.render('index', { message });
  });

  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
```

**`views/index.jsx`**:

```jsx
export default function Index({ message }) {
  return <p>{message}</p>;
}
```

Finally, just run `npm start` and go to `http://localhost:3000`, and you'll see `Hello World!`.

### With @react-ssr/nestjs-express

Install it:

```bash
# install NestJS dependencies
$ npm install --save @nestjs/core @nestjs/common @nestjs/platform-express

# install @react-ssr/nestjs-express
$ npm install --save @react-ssr/core @react-ssr/nestjs-express react react-dom
```

And add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "ts-node --project tsconfig.server.json server/main.ts"
  }
}
```

Then, populate files below inside your project:

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules",
    "ssr.config.js",
    "dist",
    ".ssr"
  ]
}
```

**`tsconfig.server.json`**:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist"
  },
  "include": [
    "server"
  ]
}
```

**`server/main.ts`**:

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // register `.tsx` as a view template engine
  await register(app);

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
})();
```

**`server/app.module.ts`**:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [
    AppController,
  ],
})
export class AppModule {}
```

**`server/app.controller.ts`**:

```ts
import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index') // this will render `views/index.tsx`
  public showHome() {
    const user = { name: 'NestJS' };
    return { user };
  }
}
```

**`views/index.tsx`**:

```tsx
interface IndexProps {
  user: any;
}

const Index = ({ user }: IndexProps) => {
  return <p>Hello {user.name}!</p>;
};

export default Index;
```

Then just run `npm start` and go to `http://localhost:3000`, you'll see `Hello NestJS!`.

## Configuration (`ssr.config.js`)

Here is the default `ssr.config.js`, which is used by `react-ssr` when there are no valid values:

```js
module.exports = {
  id: 'default',
  distDir: '.ssr',
  viewsDir: 'views',
  staticViews: [],
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    return config;
  },
};
```

### `ssr.config.js#id`

The id of **UI framework**. (default: `default`)

It can be ignored only when the project does not use any UI frameworks.

Supported UI frameworks are:

- [x] default (the id `default` doesn't need to be specified in `ssr.config.js`)
  - [x] [bulma](https://bulma.io)
  - [x] [semantic-ui](https://react.semantic-ui.com)
  - [x] Or any other **non** CSS-in-JS UI frameworks
- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [x] [antd](https://ant.design)
- [ ] and more...

For example, if we want to use `emotion`, `ssr.config.js` is like this:

```js
module.exports = {
  id: 'emotion',
};
```

### `ssr.config.js#distDir`

The place where `react-ssr` generates **production** results. (default: `.ssr`)

If we use TypeScript or any other library which must be compiled, the config below may be useful:

```js
module.exports = {
  // dist folder should be ignored by `.gitignore`
  distDir: 'dist/.ssr',
};
```

### `ssr.config.js#viewsDir`

The place where we put views. (default: `views`)

A function `res.render('xxx')` will render `views/xxx.jsx` or `views/xxx.tsx`.

A working example is here: [examples/basic-custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-views)

### `ssr.config.js#staticViews`

If specified, `react-ssr` generates html cache when production:

```js
module.exports = {
  staticViews: [
    'auth/login',
    'auth/register',
    'about',
  ],
};
```

### `ssr.config.js#webpack()`

```js
module.exports = {
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    // we can override default webpack config here
    return config;
  },
};
```

## Custom `process.env.NODE_ENV`

If you set `process.env.REACT_SSR_ENV`, you can separate `process.env.NODE_ENV` from react-ssr:

**package.json**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=k8s REACT_SSR_ENV=production node dist/main.js"
  }
}
```

## Custom Babel Config

We can extends its default `.babelrc` like this:

**`.babelrc`**:

```json
{
  "presets": [
    "@react-ssr/express/babel"
  ]
}
```

A working example is here: [examples/basic-custom-babelrc](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-babelrc)

## Custom App

Just put `_app.jsx` or `_app.tsx` into the views root:

**`views/_app.jsx`**:

```jsx
// we can import global styles or use theming
import '../styles/global.scss';

const App = (props) => {
  // yes, this `props` contains data passed from the server
  // and also we can inject additional data into pages
  const { children, ...rest } = props;

  // we can wrap this PageComponent for persisting layout between page changes
  const PageComponent = children;

  return <PageComponent {...rest} />;
};

export default App;
```

A working example is here:

- [examples/basic-custom-app](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-app)
- [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
- [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)

## Custom Document

Just put `_document.jsx` or `_document.tsx` into the views root:

**`views/_document.jsx`**:

```jsx
import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/express';

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
}
```

**Note**:

- **Please put `<Main />` component directly under `<body>` tag and don't wrap `<Main />` component with another components**, because this is a hydration target for the client.

And then, use it as always:

**`views/index.jsx`**:

```jsx
const Index = (props) => {
  return <p>Hello World!</p>;
};

export default Index;
```

A working example is here: [examples/basic-custom-document](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-document)

## Dynamic `Head`

We can use the `Head` component in any pages:

**`views/index.jsx`**:

```jsx
import React from 'react';
import { Head } from '@react-ssr/express';

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

- [x] default (the id `default` doesn't need to be specified in `ssr.config.js`)
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
} from '@react-ssr/express';

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
    "@react-ssr/express/babel"
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
    "@react-ssr/express/babel"
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
    "@react-ssr/express/babel"
  ],
  "plugins": [
    "styled-components"
  ]
}
```

A working example is here: [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

## TypeScript Support

To enable TypeScript engine (`.tsx`), just put `tsconfig.json` in your project root directory.

The code of TypeScript will be like this:

**`package.json`**:

```json
{
  "scripts": {
    "start": "ts-node server.ts"
  }
}
```

**`server.ts`**:

```ts
import express, { Request, Response } from 'express';
import register from '@react-ssr/express/register';

const app = express();

(async () => {
  // register `.tsx` as a view template engine
  await register(app);

  app.get('/', (req: Request, res: Response) => {
    const message = 'Hello World!';
    res.render('index', { message });
  });

  app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
})();
```

**`views/index.tsx`**:

```tsx
interface IndexProps {
  message: string;
}

export default function Index({ message }: IndexProps) {
  return <p>{message}</p>;
}
```

## Examples

### @react-ssr/express

**.jsx**

- [examples/basic-jsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx)
- [examples/basic-custom-app](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-app)
- [examples/basic-custom-babelrc](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-babelrc)
- [examples/basic-custom-document](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-document)
- [examples/basic-custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-custom-views)
- [examples/basic-dynamic-head](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-dynamic-head)
- [examples/basic-hmr-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-hmr-css)
- [examples/basic-hmr-scss](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-hmr-scss)
- [examples/basic-blogging](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-blogging)
- [examples/basic-multiple-view-engines](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-multiple-view-engines)
- [examples/support-yarn2-pnp](https://github.com/saltyshiomix/react-ssr/tree/master/examples/support-yarn2-pnp)
- [examples/with-jsx-antd](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-antd)
- [examples/with-jsx-bulma](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-bulma)
- [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
- [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)
- [examples/with-jsx-semantic-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-semantic-ui)
- [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

**.tsx**

- [examples/basic-tsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx)
- [examples/with-tsx-redux-todo](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-tsx-redux-todo)

### @react-ssr/nestjs-express

- [examples/basic-nestjs](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs)
- [examples/basic-nestjs-nodemon](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs-nodemon)

## Real World Examples

- [react-ssr-jsx-starter](https://github.com/saltyshiomix/react-ssr-jsx-starter)
- [react-ssr-tsx-starter](https://github.com/saltyshiomix/react-ssr-tsx-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)
- [react-ssr-redux-todo-app](https://github.com/saltyshiomix/react-ssr-redux-todo-app)

## Articles

[Introducing an Alternative to NEXT.js](https://dev.to/saltyshiomix/introducing-an-alternative-to-next-js-12ph)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## Contact

- via [GitHub Issues](https://github.com/saltyshiomix/react-ssr/issues)
- via [Twitter](https://twitter.com/saltyshiomix)
