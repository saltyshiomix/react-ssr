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

export const Layout = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <Body>
        <Wrapper>
          {props.children}
        </Wrapper>
      </Body>
    </html>
  );
};
