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
# install NestJS dependencies
$ npm install --save @nestjs/core @nestjs/common @nestjs/platform-express

# install @react-ssr/nestjs-express
$ npm install --save @react-ssr/nestjs-express react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "ts-node --project tsconfig.server.json server/main.ts"
  }
}
```

Populate files below inside your project:

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
    "dist",
    ".cache"
  ]
}
```

**`./tsconfig.server.json`**

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

**`./server/main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // enable `.tsx` view template engine
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
import React from 'react';

interface IndexProps {
  user: any;
}

const Index = ({ user }: IndexProps) => {
  return <p>Hello {user.name}!</p>;
};

export default Index;
```

and then just run `npm start` and go to `http://localhost:3000`, you'll see `Hello NestJS!`.

## Rules

- The each view must be a single entry point
  - Don't create other components in the views directory
- The each view's extension must be `.tsx`

## Configuration

### Registrar Configuration

**`./server/main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // default configuration
  await register(app, {
    viewsDir: 'views',
    cacheDir: '.cache',
  });

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
}

bootstrap();
```

### `ssr.config.js`

```js
module.exports = {
  webpack: (config, env) => {
    // we can override the default webpack config here
    return config;
  },
};
```

For example, let's consider we want to import css files directly:

**styles/index.css**

```css
body {
  background-color: burlywood;
}
```

**views/index.tsx**

```tsx
import '../styles/index.css';
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

In the layout, we must inject `@react-ssr/nestjs-express/script` at the bottom of the body tag:

**./components/layout.jsx**

```jsx
import ReactSsrScript from '@react-ssr/nestjs-express/script';

export const Layout = (props) => {
  const {
    children,
    script, // passed from the entry point (./views/index.jsx)
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
import { Layout } from '../components/layout';

const Index = (props) => {
  const { script } = props; // `props.script` is injected by @react-ssr/express automatically

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

## Supported UI Framework

- [x] [emotion](https://emotion.sh)
- [x] [styled-components](https://www.styled-components.com)
- [x] [material-ui](https://material-ui.com)
- [ ] [antd](https://ant.design)
- [ ] and more...

### With Emotion

In order to enable SSR, we must install these dependencies:

- `babel-plugin-emotion` (devDependencies)
- `emotion` (dependencies)
- `emotion-server` (dependencies)

And then, populate `.babelrc` in your project root:

```json
{
  "presets": [
    "@react-ssr/nestjs-express/babel"
  ],
  "plugins": [
    "emotion"
  ]
}
```

Finally, with custom layout, inject `@react-ssr/nestjs-express/script` at the bottom of the body tag:

```tsx
import ReactSsrScript from '@react-ssr/nestjs-express/script';

export const Layout = (props) => {
  const { script } = props;

  return (
    <html>
      <head>
        <title>Hello Emotion</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
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

Finally, with custom layout, inject `@react-ssr/nestjs-express/script` at the bottom of the body tag:

```jsx
import ReactSsrScript from '@react-ssr/nestjs-express/script';

export const Layout = (props) => {
  const { script } = props;

  return (
    <html>
      <head>
        <title>Hello styled-components</title>
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
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
    "@react-ssr/nestjs-express": "latest"
  }
}
```

## Starters

- [react-ssr-jsx-starter](https://github.com/saltyshiomix/react-ssr-jsx-starter)
- [react-ssr-tsx-starter](https://github.com/saltyshiomix/react-ssr-tsx-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)

## How it works

WIP

## Related

[reactjs/express-react-views](https://github.com/reactjs/express-react-views)
