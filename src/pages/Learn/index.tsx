import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import LessLearn from './LessLearn';
import ComponentLearn from './ComponentLearn';

const tabList = [
  {
    tab: 'Less Learn',
    key: 'lessLearn',
    children: <LessLearn />,
  },
  {
    tab: 'Component Learn',
    key: 'componentLearn',
    children: <ComponentLearn />,
  },
];
export default function Learn() {
  return (
    <PageContainer
      tabList={tabList}
      header={{
        title: null,
        breadcrumb: {},
      }}
    />
  );
}
