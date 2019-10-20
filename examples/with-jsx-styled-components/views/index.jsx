import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../components';

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
  const {
    user,
    script, // injected by @react-ssr/express
  } = props;

  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Layout
      title="with-jsx-styled-components - @react-ssr/express"
      script={script} // pass it for dynamic SSR
    >
      <Paragraph>Hello {user.name}!</Paragraph>
      <Button onClick={onClick}>Click Me</Button>
      <Paragraph>Message from state: {message}</Paragraph>
    </Layout>
  );
};

export default Index;
