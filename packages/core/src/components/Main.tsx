import React from 'react';

const DocumentContext = require('./document-context');

export default class Main extends React.Component {
  render() {
    return (
      <DocumentContext.Consumer>
        {(value: any) => {
          const {
            children,
            props,
          } = value;
          return (
            <div id="react-ssr-root">
              {React.cloneElement(children, props)}
            </div>
          );
        }}
      </DocumentContext.Consumer>
    );
  }
}
