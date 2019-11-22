import React from 'react';
import { Head } from '@react-ssr/express';
import {
  Breadcrumb,
  Divider,
  Container,
  Header,
  Button,
  Message,
} from 'semantic-ui-react';

const Index = ({ user }) => {
  const [message, setMessage] = React.useState('waiting...');

  const onClick = () => setMessage('This is a react-ssr!');

  return (
    <React.Fragment>
      <Head>
        <title>with-jsx-semantic-ui - @react-ssr/express</title>
      </Head>
      <Container
        style={{ marginTop: 10 }}
        text
      >
        <Breadcrumb>
          <Breadcrumb.Section link>@react-ssr/express</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right arrow' />
          <Breadcrumb.Section active>with-jsx-semantic-ui</Breadcrumb.Section>
        </Breadcrumb>
        <Divider />
        <Header as='h2'>Hello {user.name}!</Header>
        <Button onClick={onClick}>Click Me</Button>
        <Message positive>
          <Message.Header>Message from state:</Message.Header>
          <p>{message}</p>
        </Message>
      </Container>
    </React.Fragment>
  );
};

export default Index;
