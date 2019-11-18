import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/express';

import 'antd/dist/antd.css';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>@react-ssr/express with Ant Design</title>
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
