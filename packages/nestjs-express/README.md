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
$ npm install --save @react-ssr/express react react-dom
```

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

## Starters

- [react-ssr-starter](https://github.com/saltyshiomix/react-ssr-starter)
- [react-ssr-nestjs-starter](https://github.com/saltyshiomix/react-ssr-nestjs-starter)
