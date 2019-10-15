import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import Page from './__REACT_SSR_PAGE_NAME__';

let renderMethod = ReactDOM.hydrate;

if ('__REACT_SSR_DEVELOPMENT__') {
  renderMethod = ReactDOM.render;
}

const props = JSON.parse('__REACT_SSR_PROPS__');

console.log(ReactDOMServer.renderToString(<Page {...props} />));

renderMethod((
  <React.Fragment>
    <Page {...props} />
    {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
  </React.Fragment>
), document.getElementById('app'));
