import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '../../lib/theme';

export const Layout = (props) => {
  return (
    <html lang="en">
      <head>
        <title>with-jsx-material-ui - @react-ssr/express</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
};
