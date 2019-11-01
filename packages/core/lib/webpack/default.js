import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');

function WithComponent(Component) {
  return class extends React.Component {
    render() {
      return <Component {...(this.props)} />;
    }
  }
}

const Extended = WithComponent(Page);

const container = hasHtml(<Extended {...props} />) ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(<Page {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
