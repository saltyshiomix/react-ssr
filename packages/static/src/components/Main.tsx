import React from 'react';

const DocumentContext = require('./document-context');

export default class Main extends React.Component {
  render() {
    return (
      <DocumentContext.Consumer>
        {(children: React.ReactNode) => children}
      </DocumentContext.Consumer>
    );
  }
}
