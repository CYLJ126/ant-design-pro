import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import ComponentLearn from './ComponentLearn';
import GmCryptoDemo from './GmCryptoDemo';
import styles from './index.less';
import MyEditorLearn from './MyEditorLearn';
import SimpleTableLearn from './SimpleTableLearn';
import DailyPage from './TimeHeaderTest';

const tabList = [
  {
    tab: 'MyEditor',
    key: 'MyEditorLearn',
  },
  {
    tab: 'DailyPage',
    key: 'DailyPage',
  },
  {
    tab: 'SimpleTable Learn',
    key: 'SimpleTableLearn',
  },
  {
    tab: 'Component Learn',
    key: 'componentLearn',
  },
  {
    tab: 'GM Crypto Demo',
    key: 'GmCryptoDemo',
  },
];

// 内容映射表
const tabContentMap: Record<string, React.ReactNode> = {
  MyEditorLearn: <MyEditorLearn />,
  DailyPage: <DailyPage />,
  SimpleTableLearn: <SimpleTableLearn />,
  componentLearn: <ComponentLearn />,
  GmCryptoDemo: <GmCryptoDemo />,
};

export default function Learn() {
  const [activeKey, setActiveKey] = useState<string>(tabList[0].key);

  return (
    <PageContainer
      className={styles.container}
      tabList={tabList}
      tabActiveKey={activeKey}
      onTabChange={(key) => setActiveKey(key)}
      header={{
        title: null,
        breadcrumb: {},
      }}
    >
      {/* 根据 activeKey 渲染对应内容 */}
      {tabContentMap[activeKey]}
    </PageContainer>
  );
}
