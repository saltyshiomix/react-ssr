import React from 'react';
import { Head } from '@react-ssr/express';
import {
  BasicCard,
  TitleCard,
  AnimatedCard,
  bounce,
} from '../components';

const NextPage = (props) => {
  const { title } = props;

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <TitleCard>
        {title}
      </TitleCard>
      <BasicCard>
        <a href="/">Go to home page</a>
      </BasicCard>
      <AnimatedCard animation={bounce}>
        Let's bounce.
      </AnimatedCard>
    </React.Fragment>
  );
};

export default NextPage;
