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
          <title>An example of basic-jsx-static</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" type="image/png" href="/images/icon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
