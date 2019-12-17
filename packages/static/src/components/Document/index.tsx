import React from 'react';

const Head = require('./head');
const Main = require('./main');

class Html extends React.Component {
  render() {
    return <html {...this.props} />;
  }
}

export default class Document extends React.Component {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
        </body>
      </Html>
    );
  }
};
