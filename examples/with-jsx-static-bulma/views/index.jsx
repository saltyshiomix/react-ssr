import React from 'react';
import { Head } from '@react-ssr/static';

import '../styles/index.scss';

const Index = () => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Head>
        <title>@react-ssr/static with Bulma</title>
      </Head>
      <div className="container">
        <p className="title">
          Message from state: {message}
        </p>
        <button
          className="button is-primary"
          onClick={onClick}
        >
          Click Me
        </button>
      </div>
    </React.Fragment>
  );
};

export default Index;
