import React, { useState } from 'react';
import { Layout } from '../components';

const Index = (props) => {
  const {
    user,
    script, // injected by @react-ssr/express
  } = props;

  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Layout
      title="An example of @react-ssr/express"
      script={script} // pass it for dynamic SSR
    >
      <p>Hello {user.name}!</p>
      <button onClick={onClick}>Click Me</button>
      <p>Message from state: {message}</p>
    </Layout>
  );
};

export default Index;
