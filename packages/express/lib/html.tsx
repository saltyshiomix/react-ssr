import React from 'react';
import ReactDOMServer from 'react-dom/server';

interface HtmlProps {
  children: React.ReactNode;
  route: string;
  injectProps: string;
}

const Html = (props: HtmlProps) => {
  const {
    children,
    route,
    injectProps,
  } = props;

  const html: string = ReactDOMServer.renderToString(<React.Fragment>{children}</React.Fragment>);

  if (html.indexOf('html') < 0) {
    return (
      <html>
        <body>
          <div id="app">{children}</div>
          <script src={route + `?props=${injectProps}`}></script>
          {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
        </body>
      </html>
    );
  }

  const normalizeStyle = {
    margin: 0,
    padding: 0,
  };

  return (
    <html style={normalizeStyle}>
      <body style={normalizeStyle}>
        <div id="wrapper">
          <iframe
            id="app"
            src={'data:text/html;charset=utf-8,' + escape(html || '')}
            frameBorder="0"
          ></iframe>
        </div>
        <script src={route + `?props=${injectProps}`}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};

export default Html;
