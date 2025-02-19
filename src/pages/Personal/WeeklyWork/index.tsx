import React, { useEffect, useState } from 'react';
import Steps from './steps';
import DayRecords from './dayRecords';
import HeadInfo from './headInfo';
import HeaderButtons from './headerButtons';
import HeaderDate from './HeaderDate';
import { Col, Row } from 'antd';
// 图标依次为：跳转到每日计划，跳转到每月计划，展开，收起，事项推迟到下周
import styles from './index.less';
import {
  getCurrentWeekWorks,
  getWeekDays,
  getWeekStatistics,
} from '@/services/ant-design-pro/dailyWork';

function addItem() {
  console.log('添加新项');
}

export default function WeeklyWork() {
  const [weekDays, setWeekDays] = useState([]);
  const [works, setWorks] = useState([]);
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    getCurrentWeekWorks().then((result) => {
      setWorks(result);
    });
  }, []);

  useEffect(() => {
    // 加载表头——周统计信息
    getWeekStatistics().then((result) => setStatistics(result));
    // 加载表头——本周每天对应的日期
    getWeekDays().then((result) => setWeekDays(result));
  }, [works]);

  // 事项列表高度 = 窗口高度 - 表头高度（43） - 分隔线（15）
  const worksHeight = window.innerHeight - 43 - 15 - 70 + 'px';

  return (
    <div>
      <Row>
        <Col span={17}>
          <HeaderButtons weekInfo={statistics} addItem={addItem} />
        </Col>
        <Col span={7}>
          <HeaderDate weekDays={weekDays} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      <div className={styles.weeklyData} style={{ height: worksHeight }}>
        {works.map((work) => {
          return (
            <Row key={work.id}>
              <Col span={5}>
                <HeadInfo headParam={work} />
              </Col>
              <Col span={12} className={styles.stepCol}>
                <Steps itemId={work.id} />
              </Col>
              <Col span={7}>
                <DayRecords itemId={work.id} />
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
