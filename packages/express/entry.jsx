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

console.log(ReactDOMServer.renderToStaticMarkup(<Page {...props} />));

const html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);

if (html.indexOf('html') < 0) {
  renderMethod(<Page {...props} />, document.getElementById('app'));
} else {
  renderMethod((
    <React.Fragment>
      <Page {...props} />
  
  
      {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
    </React.Fragment>
  ), document.body.appendChild(document.createElement('div')));
}
