import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const PageComponent = React.forwardRef((props, ref) => <Page innerRef={ref} {...props} />);

function App(props) {
  const { innerRef, ...rest } = props;
  return (
    <PageComponent
      ref={innerRef}
      {...rest}
    />
  );
}

const ref = React.createRef();

const container = hasHtml(<App innerRef={ref} {...props} />) ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(<App innerRef={ref} {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
