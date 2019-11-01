import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';
import {
  extractHeadElements,
  convertAttrToJsxStyle,
} from '../helpers/head';
import { SsrProps } from './interfaces';

const { ServerStyleSheets } = require('@material-ui/core/styles');

export default function Ssr(props: SsrProps) {
  const {
    children,
    script,
  } = props;

  const {
    Title,
    MetaDescription,
  } = extractHeadElements(children);

  const sheets = new ServerStyleSheets();
  const html = ReactDOMServer.renderToString(sheets.collect(children));
  const withHtml = 0 <= html.toLowerCase().indexOf('html');

  if (withHtml) {
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
          <script src={script}></script>
        </body>
      </html>
    );
  } else {
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
          <script src={script}></script>
        </body>
      </html>
    );
  }
};
