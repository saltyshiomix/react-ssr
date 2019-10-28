import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';
import {
  getSsrId,
  convertAttrToJsxStyle,
  createTitleComponent,
  createMetaDescriptionComponent,
} from './helpers/head';
import {
  useTitle,
  useMeta,
} from './helpers/hooks';

interface SsrProps {
  children: any;
  script: string;
}

export const Ssr = (props: SsrProps) => {
  const {
    children,
    script,
  } = props;

  const html: string = ReactDOMServer.renderToStaticMarkup(children).toLowerCase();
  const headElements = [...(Head.elements)];

  console.log(headElements);

  const withHtml: boolean = 0 <= html.toLowerCase().indexOf('html');
  const ssrId = getSsrId(html);

  let Title = undefined;
  let MetaDescription = undefined;
  if (0 < headElements.length) {
    Title = createTitleComponent(headElements);
    MetaDescription = createMetaDescriptionComponent(headElements);
  }

  try {
    switch (ssrId) {
      case 'material-ui': {
        const { ServerStyleSheets } = require('@material-ui/core/styles');
        const sheets = new ServerStyleSheets();
        if (withHtml) {
          const html = ReactDOMServer.renderToStaticMarkup(
            sheets.collect(React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` }))
          );
          const $ = cheerio.load(html);
          const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
          const styles = $.html($('head style'));
          const body = $('body').html();
          return (
            <html {...convertAttrToJsxStyle($('html').attr())}>
              <head>
                {Title ? <Title /> : ReactHtmlParser($.html($('title')))}
                {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
                {ReactHtmlParser(meta)}
                {ReactHtmlParser(styles)}
                {sheets.getStyleElement()}
              </head>
              <body {...convertAttrToJsxStyle($('body').attr())}>
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
                {Title && <Title />}
                {MetaDescription && <MetaDescription />}
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
          const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
          const styles = $.html($('head style'));
          const body = $('body').html();
          return (
            <html {...convertAttrToJsxStyle($('html').attr())}>
              <head>
                {Title ? <Title /> : ReactHtmlParser($.html($('title')))}
                {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
                {ReactHtmlParser(meta)}
                {ReactHtmlParser(styles)}
                {styleElement}
              </head>
              <body {...convertAttrToJsxStyle($('body').attr())}>
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
                {Title && <Title />}
                {MetaDescription && <MetaDescription />}
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
          const html = ReactDOMServer.renderToStaticMarkup(React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` }));
          const $ = cheerio.load(html);
          const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
          const styles = $.html($('head style'));
          const body = $('body').html();
          return (
            <html {...convertAttrToJsxStyle($('html').attr())}>
              <head>
                {Title ? <Title /> : ReactHtmlParser($.html($('title')))}
                {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
                {ReactHtmlParser(meta)}
                {ReactHtmlParser(styles)}
              </head>
              <body {...convertAttrToJsxStyle($('body').attr())}>
                {body ? ReactHtmlParser(body) : null}
                <script id="react-ssr-script" src={`${script}&ssrid=${ssrId}`}></script>
                {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
              </body>
            </html>
          );
        } else {
          return (
            <html>
              <head>
                {Title && <Title />}
                {MetaDescription && <MetaDescription />}
              </head>
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
  } finally {
    Head.elements = [];
  }
};

export const Head = ({ children }: { children: React.ReactNode }) => {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    Head.elements.push(element);

    switch (element.type) {
      case 'title':
        useTitle(element.props.children);
        break;

      case 'meta':
        useMeta(element.props);
        break;

      default:
        break;
    }
  }
  return null;
}

Head.elements = [] as React.ReactElement[];
