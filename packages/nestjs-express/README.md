<p align="center">😎 @react-ssr/nestjs-express 😎</p>
<p align="center">
  <a href="https://npm.im/@react-ssr/nestjs-express" alt="A version of @react-ssr/nestjs-express">
    <img src="https://img.shields.io/npm/v/@react-ssr/nestjs-express.svg">
  </a>
  <a href="https://npm.im/@react-ssr/nestjs-express" alt="Downloads of @react-ssr/nestjs-express">
    <img src="https://img.shields.io/npm/dt/@react-ssr/nestjs-express.svg">
  </a>
  <img src="https://img.shields.io/npm/l/@react-ssr/nestjs-express.svg" alt="Package License (MIT)">
</p>

## Overview

- SSR (Server Side Rendering) as a view template engine
- Passing the server data to the client `props`
- Dynamic `props` without caring about SSR
  - Suitable for dynamic routes like blogging
- Dynamic `Head` component
- HMR when `process.env.NODE_ENV !== 'production'`

## Usage

Install it:

```bash
# install NestJS dependencies
$ npm install --save @nestjs/core @nestjs/common @nestjs/platform-express

# install @react-ssr/nestjs-express
$ npm install --save @react-ssr/nestjs-express react react-dom
```

And add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "ts-node --project tsconfig.server.json server/main.ts"
  }
}
```

Populate files below inside your project:

**`./.babelrc`**

```json
{
  "presets": [
    "@react-ssr/nestjs-express/babel"
  ]
}
```

**`./tsconfig.json`**

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
    "isolatedModules": true,
    "resolveJsonModule": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules",
    ".ssr"
  ]
}
```

**`./tsconfig.server.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs"
  },
  "include": [
    "server"
  ]
}
```

**`./server/main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // register `.tsx` as a view template engine
  await register(app);

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
}

bootstrap();
```

**`./server/app.module.ts`**

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

**`./server/app.controller.ts`**

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

**`./views/index.tsx`**

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
  viewsDir: 'views',
  distDir: '.ssr',
  webpack: (config /* webpack.Configuration */, env /* 'development' | 'production' */) => {
    return config;
  },
};
```

### `ssr.config.js#id`

The id of **UI framework**. (default: `default`)

It can be ignored only when the project does not use any UI frameworks.

Supported UI frameworks are:

- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [ ] [antd](https://ant.design)
- [ ] and more...

For example, if we want to use `emotion`, `ssr.config.js` is like this:

```js
module.exports = {
  id: 'emotion',
};
```

### `ssr.config.js#viewsDir`

The place where we put views. (default: `views`)

A function `res.render('xxx')` will render `views/xxx.jsx` or `views/xxx.tsx`.

A working example is here: [examples/custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-views)

### `ssr.config.js#distDir`

The place where `react-ssr` outputs production results. (default: `.ssr`)

If we use TypeScript or any other library which must be compiled, the config below may be useful:

```js
module.exports = {
  // dist folder should be ignored by `.gitignore`
  distDir: 'dist/.ssr',
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

For example, let's consider we want to import css files directly:

**views/index.tsx**

```tsx
import '../styles/index.css';
```

**styles/index.css**

```css
body {
  background-color: burlywood;
}
```

Then, we must override the default webpack config like this:

**ssr.config.js**

```js
module.exports = {
  webpack: (config, env) => {
    config.module.rules = [
      ...(config.module.rules),
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ];
    return config;
  },
};
```

A working example is here: [examples/basic-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-css)

## Custom Layout

Just put `_document.tsx` into the views root:

**./views/_document.tsx**

```tsx
import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/nestjs-express';

export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>Default Title</title>
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
```

And then, use it as always:

**./views/index.tsx**

```tsx
const Index = (props) => {
  return <p>Hello Layout!</p>;
};

export default Index;
```

A working example is here: [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)

## Dynamic `Head`

We can use the `Head` component **anyware**:

**./views/index.tsx**

```tsx
import React from 'react';
import { Head } from '@react-ssr/nestjs-express';

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

A working example is here: [examples/dynamic-head](https://github.com/saltyshiomix/react-ssr/tree/master/examples/dynamic-head)

## Supported UI Framework

- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [ ] [antd](https://ant.design)
- [ ] and more...

### With Emotion

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

### With styled-components

In order to enable SSR, we must install `babel-plugin-styled-components` as devDependencies.

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/nestjs-express/babel"
  ],
  "plugins": [
    "styled-components"
  ]
}
```

A working example is here: [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

### With Material UI

We can use [material-ui](https://material-ui.com) without extra configuration.

A working example is here: [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)

### With Ant Design

WIP

## Examples

- [examples/basic-blogging](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-blogging)
- [examples/basic-css](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-css)
- [examples/basic-jsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-jsx)
- [examples/basic-nestjs](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs)
- [examples/basic-nestjs-nodemon](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-nestjs-nodemon)
- [examples/basic-tsx](https://github.com/saltyshiomix/react-ssr/tree/master/examples/basic-tsx)
- [examples/custom-layout](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-layout)
- [examples/custom-views](https://github.com/saltyshiomix/react-ssr/tree/master/examples/custom-views)
- [examples/dynamic-head](https://github.com/saltyshiomix/react-ssr/tree/master/examples/dynamic-head)
- [examples/with-jsx-emotion](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-emotion)
- [examples/with-jsx-material-ui](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-material-ui)
- [examples/with-jsx-styled-components](https://github.com/saltyshiomix/react-ssr/tree/master/examples/with-jsx-styled-components)

## Starters

- [react-ssr-jsx-starter](https://github.com/saltyshiomix/react-ssr-jsx-starter)
- [react-ssr-tsx-starter](https://github.com/saltyshiomix/react-ssr-tsx-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## Related

[reactjs/express-react-views](https://github.com/reactjs/express-react-views)
