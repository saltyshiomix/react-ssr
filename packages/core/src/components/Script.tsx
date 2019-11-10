import React from 'react';

const DocumentContext = require('./document-context');

export default class Script extends React.Component {
  render() {
    return (
      <DocumentContext.Consumer>
        {(value: any) => <script src={value.script}></script>}
      </DocumentContext.Consumer>
    );
  }
}
