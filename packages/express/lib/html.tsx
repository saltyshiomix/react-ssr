import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';

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

  const Component = (props: any) => {
    return (
      <React.Fragment>
        {props.children}
      </React.Fragment>
    );
  };
  console.log('HTML.TSX:');
  console.log(ReactDOMServer.renderToString(<Component children={children} />));

  return (
    <React.Fragment>
      <div id="app">{children}</div>
      <script src={route + `?props=${injectProps}`}></script>
      {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
    </React.Fragment>
  );
};

export default Html;
