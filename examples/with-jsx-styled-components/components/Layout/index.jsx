import ReactSsrScript from '@react-ssr/express/script';
import styled from 'styled-components';

const Body = styled.body`
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

export const Layout = (props) => {
  const {
    title,
    children,
    script,
  } = props;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <Body>
        <Wrapper>
          {children}
        </Wrapper>
        <ReactSsrScript script={script} />
      </Body>
    </html>
  );
};
