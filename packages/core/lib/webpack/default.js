import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const App = React.forwardRef((props, ref) => <Page ref={ref} {...props} />);

const ref = React.createRef();

const container = hasHtml(<App ref={ref} {...props} />) ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(<App ref={ref} {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
