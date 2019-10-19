import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';

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
      if (withHtml) {
        return React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` });
      } else {
        const html = ReactDOMServer.renderToString(React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` }));
        const $ = cheerio.load(html);
        const htmlAttr = $('html').attr();
        const bodyAttr = $('body').attr();
        const head = $('head').html();
        const body = $('body').html();

        console.log(head);

        console.log('');

        console.log($('head style').html());

        return (
          <html {...htmlAttr}>
            <head>
              {head ? ReactHtmlParser(head) : null}
            </head>
            <body {...bodyAttr}>
              {body ? ReactHtmlParser(body) : null}
            </body>
          </html>
        );
      }
      break;

    default:
      if (withHtml) {
        return React.cloneElement(children, { script: `${script}&ssrid=${ssrId}` });
      } else {
        return (
          <html>
            <body data-ssr-id={ssrId}>
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
