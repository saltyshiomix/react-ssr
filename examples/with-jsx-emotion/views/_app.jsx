import React from 'react';
import { css, Global } from '@emotion/core';

const App = (props) => {
  return (
    <React.Fragment>
      <Global
        styles={css`
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
          }
          body {
            padding: 2rem 4rem;
            background: papayawhip;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 24px;
          }
        `}
      />
      {props.children}
    </React.Fragment>
  );
};

export default App;
