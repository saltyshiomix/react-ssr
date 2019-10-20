import React, { useState } from 'react';
import styled from 'styled-components';

const Paragraph = styled.p`
  color: palevioletred;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const Index = ({ user }) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <Wrapper>
      <Paragraph>Hello {user.name}!</Paragraph>
      <button onClick={onClick}>Click Me</button>
      <Paragraph>Message from state: {message}</Paragraph>
    </Wrapper>
  );
};

export default Index;
