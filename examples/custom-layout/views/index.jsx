import React from 'react';
import Head from '@react-ssr/express/head';
import { Layout } from '../components/Layout';

const Index = (props) => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Layout>
      <Head>
        <title>An example of @react-ssr/express</title>
      </Head>
      <p>Hello {props.user.name}!</p>
      <button onClick={onClick}>Click Me</button>
      <p>Message from state: {message}</p>
    </Layout>
  );
};

export default Index;
