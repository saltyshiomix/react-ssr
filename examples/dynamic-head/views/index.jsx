import React, { useState } from 'react';
import Head from '@react-ssr/express/head';
import { Layout } from '../components/Layout';

const Index = (props) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Layout script={props.script}>
      <Head>
        <title>Overrided Title</title>
      </Head>
      <p>Hello {props.user.name}!</p>
      <button onClick={onClick}>Click Me</button>
      <p>Message from state: {message}</p>
    </Layout>
  );
};

export default Index;
