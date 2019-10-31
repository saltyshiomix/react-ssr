import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';
import {
  getSsrId,
  convertAttrToJsxStyle,
  getHeadElement,
  createTitleComponent,
  createMetaDescriptionComponent,
} from './helpers/head';

interface SsrProps {
  children: any;
  script: string;
}

export default function Ssr(props: SsrProps) {
  const {
    children,
    script,
  } = props;

  // the dynamic Head component has React Hooks, so these two lines are must be at the top of this function scope
  const headElement = getHeadElement(children as React.ReactElement);
  let elements = headElement ? headElement.type.elements : [];

  // clear the cache, but use the same instance
  elements.length = 0;

  const html: string = ReactDOMServer.renderToStaticMarkup(children).toLowerCase();
  const withHtml: boolean = 0 <= html.toLowerCase().indexOf('html');
  const ssrId = getSsrId(html);

  let Title = undefined;
  let MetaDescription = undefined;
  if (0 < elements.length) {
    Title = createTitleComponent(elements);
    MetaDescription = createMetaDescriptionComponent(elements);
  }

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
            </body>
          </html>
        );
      }
    }
  }
};
