import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import { TimeTraces } from '@/pages/Personal/TimeTrace';
import { DailyWork } from '@/pages/Personal/DailyWork';
import { WeeklyWork } from '@/pages/Personal/WeeklyWork';
import { MonthlyWork } from '@/pages/Personal/MonthlyWork';
import QuarterlyWork from '@/pages/Personal/QuarterlyWork';
import SemiannualWork from '@/pages/Personal/SemiannualWork';
import AnnualWork from '@/pages/Personal/AnnualWork';
import KeepAlive from 'react-activation';
import { MenuSlot } from '@/pages/Personal/GeneralManagement/MenuSlot';
import Tags from '@/pages/Personal/Tags';
import styles from './index.less';

export function GeneralManagement() {
  const tabInfos = [
    {
      label: '痕',
      key: '1',
      children: <TimeTraces />,
    },
    {
      label: '日',
      key: '2',
      children: <DailyWork />,
    },
    {
      label: '周',
      key: '3',
      children: <WeeklyWork />,
    },
    {
      label: '月',
      key: '4',
      children: <MonthlyWork />,
    },
    {
      label: '季',
      key: '5',
      children: <QuarterlyWork />,
    },
    {
      label: '半',
      key: '6',
      children: <SemiannualWork />,
    },
    {
      label: '年',
      key: '7',
      children: <AnnualWork />,
    },
    {
      label: '签',
      key: '8',
      children: <Tags />,
    },
  ];
  const [tabsHeight, setTabsHeight] = useState(window.innerHeight - 43);

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
    <Tabs
      className={styles.tabs}
      style={{ height: tabsHeight + 'px' }}
      items={tabInfos}
      tabPosition="left"
      tabBarExtraContent={<MenuSlot />}
    />
  );
}

export default () => {
  return (
    <KeepAlive name="generalManagement">
      <GeneralManagement />
    </KeepAlive>
  );
};
