import React from 'react';
import {
  Layout,
  BasicCard,
  TitleCard,
  HoverableCard,
} from '../components';

const Home = (props) => {
  const {
    title,
    script, // injected by @react-ssr/express
  } = props;

  return (
    <Layout
      title={title}
      script={script} // pass it for dynamic SSR
    >
      <div>
        <TitleCard>
          {title}
        </TitleCard>
        <BasicCard>
          <a href="/next">Go to next page</a>
        </BasicCard>
        <HoverableCard>
          With <code>:hover</code>.
        </HoverableCard>
      </div>
    </Layout>
  );
};

export default Home;
