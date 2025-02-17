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
  getWeekDateHeader,
  getWeekStatistics,
} from '@/services/ant-design-pro/dailyWork';

function addItem() {
  console.log('添加新项');
}

export default function WeeklyWork() {
  const [weekDateHeader, setWeekDateHeader] = useState();
  const [works, setWorks] = useState([]);

  useEffect(() => {
    getCurrentWeekWorks().then((result) => {
      setWorks(result);
    });
  }, []);

  useEffect(() => {
    getWeekDateHeader().then((result) => {
      setWeekDateHeader(result);
    });
  }, [works]);

  return (
    <div>
      <Row>
        <Col span={17}>
          <HeaderButtons weekInfo={getWeekStatistics()} addItem={addItem} />
        </Col>
        <Col span={7}>
          <HeaderDate weekId={weekDateHeader?.id} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
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
  );
}
