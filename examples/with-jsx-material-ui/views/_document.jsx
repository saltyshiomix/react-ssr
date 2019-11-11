import React from 'react';
import {
  Document,
  Head,
  Main,
  Script,
} from '@react-ssr/express';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '../lib/theme';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <title>with-jsx-material-ui - @react-ssr/express</title>
        </Head>
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Main />
          </ThemeProvider>
          <Script />
        </body>
      </html>
    );
  }
};
