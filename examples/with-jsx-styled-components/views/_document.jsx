import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/express';
import styled from 'styled-components';

const Body = styled.body`
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
  min-height: 100vh;
`;

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>An example of @react-ssr/express</title>
        </Head>
        <Body>
          <Wrapper>
            <Main />
          </Wrapper>
        </Body>
      </html>
    );
  }
};
