import React from 'react';
import { Head } from '@react-ssr/static';

const Index = () => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Head>
        <title>
          basic-tsx-static - @react-ssr/static
        </title>
      </Head>
      <p>Message from state: {message}</p>
      <button onClick={onClick}>Click Me</button>
    </React.Fragment>
  );
};

export default Index;
