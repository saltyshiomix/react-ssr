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

## Usage

### With @react-ssr/express

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
export default function Index({ message }) {
  return <p>{message}</p>;
}
```

and then just run `npm start` and go to `http://localhost:3000`.

You'll see `Hello World!`.

### With @react-ssr/nestjs-express

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
interface IndexProps {
  user: any;
}

const Index = ({ user }: IndexProps) => {
  return <p>Hello {user.name}!</p>;
};

export default Index;
```

and then just run `npm start` and go to `http://localhost:3000`, you'll see `Hello NestJS!`.

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

- [react-ssr-jsx-starter](https://github.com/saltyshiomix/react-ssr-jsx-starter)
- [react-ssr-tsx-starter](https://github.com/saltyshiomix/react-ssr-tsx-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)
