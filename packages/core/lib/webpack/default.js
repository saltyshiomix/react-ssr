import React from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const markup = `<html lang="en">${document.documentElement.innerHTML}</html>`;

function App(props) {
  const [hydrate, setHydrate] = React.useState(false);

  React.useEffect(() => {
    setHydrate(true);
  }, []);

  if (!hydrate) {
    return ReactHtmlParser(markup);
  }

  return <Page {...props} />;
}

ReactDOM.hydrate(<App {...props} />, document.getElementById('react-ssr-root') || document);

if (module.hot) {
  module.hot.accept();
}
