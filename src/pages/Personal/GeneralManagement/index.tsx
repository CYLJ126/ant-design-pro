import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { debounce } from 'lodash';
import TimeTraces from '@/pages/Personal/TimeTrace';
import DailyWork from '@/pages/Personal/DailyWork';
import WeeklyWork from '@/pages/Personal/WeeklyWork';
import MonthlyWork from '@/pages/Personal/MonthlyWork';
import QuarterlyWork from '@/pages/Personal/QuarterlyWork';
import SemiannualWork from '@/pages/Personal/SemiannualWork';
import AnnualWork from '@/pages/Personal/AnnualWork';
import KeepAlive from 'react-activation';
import { MenuSlot } from '@/pages/Personal/GeneralManagement/MenuSlot';
import Tags from '@/pages/Personal/Tags';
import styles from './index.less';
import { GeneralManagementProvider } from './GeneralManagementContext';
import TodoWorPane from '@/pages/Personal/TodoWork';

const tabInfos = [
  {
    label: '痕',
    key: 'TimeTraces',
    children: <TimeTraces />,
    sideBarSpan: 6, // 侧边栏宽度
  },
  {
    label: '日',
    key: 'DailyWork',
    children: <DailyWork />,
    sideBarSpan: 6,
  },
  {
    label: '周',
    key: 'WeeklyWork',
    children: <WeeklyWork />,
    sideBarSpan: 0,
  },
  {
    label: '月',
    key: 'MonthlyWork',
    children: <MonthlyWork />,
    sideBarSpan: 6,
  },
  {
    label: '季',
    key: 'QuarterlyWork',
    children: <QuarterlyWork />,
    sideBarSpan: 6,
  },
  {
    label: '半',
    key: 'SemiannualWork',
    children: <SemiannualWork />,
    sideBarSpan: 6,
  },
  {
    label: '年',
    key: 'AnnualWork',
    children: <AnnualWork />,
    sideBarSpan: 6,
  },
  {
    label: '签',
    key: 'Tags',
    children: <Tags />,
    sideBarSpan: 6,
  },
];

function getActiveInfo(activeKey) {
  let filter = tabInfos.filter((item) => item.key === activeKey);
  return filter?.[0];
}

export function GeneralManagement() {
  const [tabsHeight, setTabsHeight] = useState(window.innerHeight - 43);
  const [sideContent, setSideContent] = useState(<TodoWorPane />);
  const [sideBarSpan, setSideBarSpan] = useState(6);

  const switchTab = (activeKey) => {
    setSideBarSpan(getActiveInfo(activeKey)?.sideBarSpan ?? 6);
  };

  const switchSide = (sideKey) => {
    switch (sideKey) {
      case 'todo':
        setSideContent(<TodoWorPane />);
        return;
    }
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      // 计算窗口高度并减去 38px
      const newHeight = window.innerHeight - 43;
      setTabsHeight(newHeight);
    }, 100); // 100ms 防抖间隔
    // 添加 resize 事件监听
    window.addEventListener('resize', handleResize);
    // 清除事件监听
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <GeneralManagementProvider>
      <Row>
        <Col span={24 - sideBarSpan}>
          <Tabs
            defaultActiveKey="DailyWork"
            className={styles.tabs}
            style={{ height: tabsHeight + 'px' }}
            items={tabInfos}
            tabPosition="left"
            tabBarExtraContent={<MenuSlot handleSwitch={switchSide} />}
            onChange={switchTab}
          />
        </Col>
        <Col span={sideBarSpan} style={{ paddingLeft: '8px' }}>
          {sideContent}
        </Col>
      </Row>
    </GeneralManagementProvider>
  );
}

export default () => {
  return (
    <KeepAlive name="generalManagement">
      <GeneralManagement />
    </KeepAlive>
  );
};
