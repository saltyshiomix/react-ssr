import React from 'react';

const DocumentContext = require('./document-context');

export default class Main extends React.Component {
  render() {
    return (
      <DocumentContext.Consumer>
        {(value: any) => (
          <div id="react-ssr-root">
            {value.children}
          </div>
        )}
      </DocumentContext.Consumer>
    );
  }
}
