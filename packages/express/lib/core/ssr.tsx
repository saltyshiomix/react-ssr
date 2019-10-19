import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';

React.useLayoutEffect = () => {};

interface SsrProps {
  children: any;
  script: string;
}

export default (props: SsrProps) => {
  const {
    children,
    script,
  } = props;

  const html: string = ReactDOMServer.renderToString(<React.Fragment>{children}</React.Fragment>).toLowerCase();
  const withHtml: boolean = 0 <= html.indexOf('html');

  let ssrId: string = 'default';
  if (0 <= html.indexOf('emotion')) {
    ssrId = 'emotion';
  }
  if (0 <= html.indexOf('mui')) {
    ssrId = 'mui';
  }

  switch (ssrId) {
    case 'mui':
      const { ServerStyleSheets } = require('@material-ui/core/styles');
      const sheets = new ServerStyleSheets();
      if (withHtml) {
        const html = ReactDOMServer.renderToString(sheets.collect(React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` })));
        const css = sheets.toString();
        const $ = cheerio.load(html);
        const htmlAttr = $('html').attr();
        const bodyAttr = $('body').attr();
        const head = $('head').html();
        const body = $('body').html();
        return (
          <html {...htmlAttr}>
            <head>
              {head ? ReactHtmlParser(head) : null}
              {/* <style id="jss-server-side">{css}</style> */}
            </head>
            <body {...bodyAttr}>
              {body ? ReactHtmlParser(body) : null}
              <script src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      } else {
        const html = ReactDOMServer.renderToString(sheets.collect(children));
        const css = sheets.toString();
        return (
          <html>
            <head>
              <style id="jss-server-side">${css}</style>
            </head>
            <body>
              <div id="react-ssr-root">
                {ReactHtmlParser(html)}
              </div>
              <script src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      }

    default:
      if (withHtml) {
        return React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` });
      } else {
        return (
          <html>
            <body>
              <div id="react-ssr-root">
                {children}
              </div>
              <script src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      }
  }
};
