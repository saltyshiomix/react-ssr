import React from 'react';
import Head from '@react-ssr/express/head';
import styled from 'styled-components';
import { Layout } from '../components/Layout';

const Paragraph = styled.p`
  color: palevioletred;
`;

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const Index = (props) => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Layout>
      <Head>
        <title>with-jsx-styled-components - @react-ssr/express</title>
      </Head>
      <Paragraph>Hello {props.user.name}!</Paragraph>
      <Button onClick={onClick}>Click Me</Button>
      <Paragraph>Message from state: {message}</Paragraph>
    </Layout>
  );
};

export default Index;
