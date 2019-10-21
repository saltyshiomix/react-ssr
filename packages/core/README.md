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

This package is internally used in [@react-ssr/express](https://npm.im/@react-ssr/express) and [@react-ssr/nestjs-express](https://npm.im/@react-ssr/nestjs-express).

## Features

- Blazing fast SSR (Server Side Rendering)
- Passing the server data to the client `props`
- Dynamic `props` without caring about SSR
  - Suitable for dynamic routes like blogging
- Hot relaoding when `process.env.NODE_ENV !== 'production'`
- TypeScript support

## Rules

- The each view must be a single entry point
  - Don't create other components in the views directory
- The each view's extension must be either `.jsx` or `.tsx`
  - We can decide freely with other components' extension

## Packages

| package | version |
| --- | --- |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |
| [@react-ssr/nestjs-express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/nestjs-express/README.md) | ![@react-ssr/nestjs-express](https://img.shields.io/npm/v/@react-ssr/nestjs-express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/nestjs-express.svg) |

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)

[[Express] React as a View Template Engine?](https://dev.to/saltyshiomix/express-react-as-a-view-template-engine-h37)
