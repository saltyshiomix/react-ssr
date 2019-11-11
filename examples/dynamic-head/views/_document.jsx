import React from 'react';
import {
  Document,
  Head,
  Main,
  Script,
} from '@react-ssr/express';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>Default Title</title>
        </Head>
        <body>
          <Main />
          <Script />
        </body>
      </html>
    );
  }
};
