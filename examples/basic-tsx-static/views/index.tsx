import React from 'react';
import { Head } from '@react-ssr/static';

const Index = () => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Head>
        <title>
          with-tsx-static - @react-ssr/static
        </title>
      </Head>
      <button onClick={onClick}>Click Me</button>
      <p>Message from state: {message}</p>
    </React.Fragment>
  );
};

export default Index;
