import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/express';
import { css, Global } from '@emotion/core';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>@react-ssr/express with Emotion</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content={'user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height'} />
        </Head>
        <Global
          styles={css`
            html, body {
              margin: 0;
              padding: 0;
              min-height: 100%;
            }
            body {
              padding: 2rem 4rem;
              background: papayawhip;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 24px;
            }
          `}
        />
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
