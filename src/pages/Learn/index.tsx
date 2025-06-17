import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import LessLearn from './LessLearn';
import ComponentLearn from './ComponentLearn';
import CarouselPopoverCardLearn from './CarouselPopoverCardLearn';
import SimpleTableLearn from './SimpleTableLearn';
import styles from './index.less';
import AILearn from './AILearn';

const tabList = [
  {
    tab: 'SimpleTable Learn',
    key: 'SimpleTableLearn',
    children: <SimpleTableLearn />,
  },
  {
    tab: 'AI Learn',
    key: 'AILearn',
    children: <AILearn />,
  },
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
  {
    tab: 'CarouselPopoverCard Learn',
    key: 'CarouselPopoverCardLearn',
    children: <CarouselPopoverCardLearn />,
  },
];
export default function Learn() {
  return (
    <PageContainer
      className={styles.container}
      tabList={tabList}
      header={{
        title: null,
        breadcrumb: {},
      }}
    />
  );
}
