import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';

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

  const $ = cheerio.load(html);
  const htmlAttr = $('html').attr();
  const bodyAttr = $('body').attr();
  const head = $('head').html();
  const body = $('body').html();

  return (
    <html {...htmlAttr} id="app">
      <head>
        {ReactHtmlParser(head || '')}
      </head>
      <body {...bodyAttr}>
        {/* <div id="app">
          {ReactHtmlParser(body || '')}
        </div> */}
        {ReactHtmlParser(body || '')}
        <script src={route + `?props=${injectProps}`}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};

export default Html;
