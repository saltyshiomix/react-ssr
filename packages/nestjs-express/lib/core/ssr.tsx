import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';

const getSsrId = (html: string): string => {
  let ssrId: string = 'default';
  0 <= html.indexOf('"mui') && (ssrId = 'material-ui');
  0 <= html.indexOf('data-emotion-css') && (ssrId = 'emotion');
  0 <= html.indexOf('"views__') && (ssrId = 'styled-components');
  return ssrId;
}

const convertAttrToJsxStyle = (attr: any) => {
  const jsxAttr: any = {};
  const keys = Object.keys(attr);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key === 'class') {
      key = 'className';
    }
    if (0 <= key.indexOf('-')) {
      if (!key.startsWith('data-')) {
        key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      }
    }
    jsxAttr[key] = attr[keys[i]];
  }
  return jsxAttr;
}

interface SsrProps {
  children: any;
  script: string;
}

export default (props: SsrProps) => {
  const {
    children,
    script,
  } = props;

  const html: string = ReactDOMServer.renderToStaticMarkup(<React.Fragment>{children}</React.Fragment>).toLowerCase();
  const withHtml: boolean = 0 <= html.indexOf('html');
  const ssrId = getSsrId(html);

  switch (ssrId) {
    case 'material-ui': {
      const { ServerStyleSheets } = require('@material-ui/core/styles');
      const sheets = new ServerStyleSheets();
      if (withHtml) {
        const html = ReactDOMServer.renderToStaticMarkup(
          sheets.collect(React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` }))
        );
        const $ = cheerio.load(html);
        const htmlAttr = $('html').attr();
        const bodyAttr = $('body').attr();
        const head = $('head').html();
        const body = $('body').html();
        return (
          <html {...convertAttrToJsxStyle(htmlAttr)}>
            <head>
              {head ? ReactHtmlParser(head) : null}
              {sheets.getStyleElement()}
            </head>
            <body {...convertAttrToJsxStyle(bodyAttr)}>
              {body ? ReactHtmlParser(body) : null}
              <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      } else {
        const html = ReactDOMServer.renderToStaticMarkup(sheets.collect(children));
        return (
          <html>
            <head>
              {sheets.getStyleElement()}
            </head>
            <body>
              <div id="react-ssr-root">
                {ReactHtmlParser(html)}
              </div>
              <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      }
    }

    case 'styled-components': {
      const { ServerStyleSheet, StyleSheetManager } = require('styled-components');
      const sheet = new ServerStyleSheet();
      let html;
      let styleElement;
      if (withHtml) {
        try {
          html = ReactDOMServer.renderToStaticMarkup(
            <StyleSheetManager sheet={sheet.instance}>
              {React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` })}
            </StyleSheetManager>
          );
          styleElement = sheet.getStyleElement();
        } catch (error) {
          console.error(error);
          return <html><body>{error}</body></html>;
        } finally {
          sheet.seal();
        }
        const $ = cheerio.load(html);
        const htmlAttr = $('html').attr();
        const bodyAttr = $('body').attr();
        const head = $('head').html();
        const body = $('body').html();
        return (
          <html {...convertAttrToJsxStyle(htmlAttr)}>
            <head>
              {head ? ReactHtmlParser(head) : null}
              {styleElement}
            </head>
            <body {...convertAttrToJsxStyle(bodyAttr)}>
              {body ? ReactHtmlParser(body) : null}
              <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      } else {
        try {
          html = ReactDOMServer.renderToStaticMarkup(
            <StyleSheetManager sheet={sheet.instance}>
              {children}
            </StyleSheetManager>
          );
          styleElement = sheet.getStyleElement();
        } catch (error) {
          console.error(error);
          return <html><body>{error}</body></html>;
        } finally {
          sheet.seal();
        }
        return (
          <html>
            <head>
              {styleElement}
            </head>
            <body>
              <div id="react-ssr-root">
                {ReactHtmlParser(html)}
              </div>
              <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      }
    }

    default: {
      if (withHtml) {
        return React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` });
      } else {
        return (
          <html>
            <body>
              <div id="react-ssr-root">
                {children}
              </div>
              <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
              {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
            </body>
          </html>
        );
      }
    }
  }
};
