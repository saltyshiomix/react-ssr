import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToString(<Page {...props} />);
const withHtml = 0 <= html.indexOf('html');
const container = withHtml ? document : document.getElementById('react-ssr-root');

function MuiApp(props) {
  const [showChild, setShowChild] = useState(false);

  React.useEffect(() => {
    setShowChild(true);

    // const jssStyles = document.getElementById('jss-server-side');
    // if (jssStyles) {
    //   jssStyles.parentNode.removeChild(jssStyles);
    // }
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <Page {...props} />;
}

ReactDOM.hydrate(<MuiApp {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
