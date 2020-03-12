import React from 'react';

const DocumentContext = require('./document-context');

const Main = () => {
  return (
    <DocumentContext.Consumer>
      {(children: React.ReactNode) => children}
    </DocumentContext.Consumer>
  );
};

export default Main;
