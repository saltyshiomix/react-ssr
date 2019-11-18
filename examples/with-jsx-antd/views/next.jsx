import React from 'react';
import { Head } from '@react-ssr/express';
import {
  Layout,
  Result,
} from 'antd';

const {
  Header,
  Content,
} = Layout;

const Next = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Header>
        <a href="/">Go to home page</a>
      </Header>
      <Content style={{ padding: 48 }}>
        <Result
          status="success"
          title="react-ssr"
          subTitle="with Ant Design"
        />
      </Content>
    </React.Fragment>
  );
};

export default Next;
