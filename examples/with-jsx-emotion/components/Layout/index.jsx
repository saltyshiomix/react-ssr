import ReactSsrScript from '@react-ssr/express/script';
import { css, Global } from '@emotion/core';

export const Layout = (props) => {
  const {
    title,
    children,
    script,
  } = props;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content={'user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height'} />
      </head>
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
      <body data-ssr-id='emotion'>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
