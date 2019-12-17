import React, { useState } from 'react';
import { Head } from '@react-ssr/express';

import '../styles/index.scss';

const Index = ({ user }) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Head>
        <title>react-ssr with Bulma</title>
      </Head>
      <div className="container">
        <h1 className="title">
          Hello {user.name}!
        </h1>
        <p className="subtitle">
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
