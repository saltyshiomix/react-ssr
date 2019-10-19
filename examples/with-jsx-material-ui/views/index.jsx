import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

const Index = ({ user }) => {
  const [message, setMessage] = useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <p>Hello {user.name}!</p>
      <Button onClick={onClick}>Click Me</Button>
      <p>Message from state: {message}</p>
    </React.Fragment>
  );
};

export default Index;
