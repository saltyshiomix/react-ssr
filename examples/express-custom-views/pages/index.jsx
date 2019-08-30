import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const Index = ({ user }) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>The example of "express-basic-jsx"</title>
      </Helmet>
      <div>
        <p>Hello {user.name}!</p>
        <button onClick={onClick}>Click Me</button>
        <p>Message from state: {message}</p>
      </div>
    </React.Fragment>
  );
};

export default Index;
