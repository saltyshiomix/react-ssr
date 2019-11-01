import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const pageRef = React.createRef();

const App = (props) => {
  return <Page ref={pageRef} {...props} />;
};

const container = hasHtml(<App {...props} />) ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(pageRef.current, container);

if (module.hot) {
  module.hot.accept();
}
