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
          <title>An example of @react-ssr/express</title>
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
