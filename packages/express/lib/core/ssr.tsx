import React from 'react';
import ReactDOMServer from 'react-dom/server';

interface SsrProps {
  children: any;
  script: string;
}

export default (props: SsrProps) => {
  const {
    children,
    script,
  } = props;

  const html: string = ReactDOMServer.renderToString(<React.Fragment>{children}</React.Fragment>);
  const withHtml: boolean = 0 <= html.indexOf('html');

  let ssrId: string = 'default';
  if (0 <= html.indexOf('emotion')) {
    ssrId = 'emotion';
  }
  const scriptWithSsrId = `${script}&ssrid=${ssrId}`

  if (withHtml) {
    return React.cloneElement(children, { script: scriptWithSsrId });
  }

  return (
    <html>
      <body data-ssr-id={ssrId}>
        <div id="react-ssr-root">
          {children}
        </div>
        <script src={scriptWithSsrId}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};
