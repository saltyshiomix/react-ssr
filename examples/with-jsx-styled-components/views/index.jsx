import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body: {
    margin: 0;
    padding: 0;
  }
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

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

const Index = ({ user }) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Wrapper>
      <GlobalStyle />
      <Paragraph>Hello {user.name}!</Paragraph>
      <Button onClick={onClick}>Click Me</Button>
      <Paragraph>Message from state: {message}</Paragraph>
    </Wrapper>
  );
};

export default Index;
