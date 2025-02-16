import React, { useState } from 'react';
import Steps from './steps';
import DayRecords, { DayContent } from './dayRecords';
import Head, { HeadContent } from './head';
import { Col, Row } from 'antd';
// 图标依次为：跳转到每日计划，跳转到每月计划，展开，收起，事项推迟到下周
import {
  ExportOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import styles from './index.less';

function getWorks(): HeadContent[] {
  return [
    {
      id: 1,
      themeShow: '工作',
      itemShow: '技术产品负责人',
      target: '完成产品场景整理',
      scoreShow: '8.5分',
      proportion: 65,
      startTime: '01/24',
      endTime: '02/24',
    },
    {
      id: 2,
      themeShow: '工作',
      itemShow: '技术产品负责人',
      target: '完成产品场景整理',
      scoreShow: '8.0分',
      proportion: 65,
      startTime: '02/25',
      endTime: '04/24',
    },
    {
      id: 3,
      themeShow: '工作',
      itemShow: '技术产品负责人',
      target: '完成产品场景整理',
      scoreShow: '9.0分',
      proportion: 65,
      startTime: '01/24',
      endTime: '02/24',
    },
    {
      id: 4,
      themeShow: '工作',
      itemShow: '技术产品负责人',
      target: '完成产品场景整理',
      scoreShow: '9.0分',
      proportion: 65,
      startTime: '01/24',
      endTime: '02/24',
    },
    {
      id: 5,
      themeShow: '工作',
      itemShow: '技术产品负责人',
      target: '完成产品场景整理',
      scoreShow: '9.0分',
      proportion: 65,
      startTime: '01/24',
      endTime: '02/24',
    },
  ];
}

function getSteps() {
  return [
    { key: 0, uuid: 0, content: '完成雇主责任险了解；' },
    { key: 1, uuid: 1, content: '完成对公险种了解；' },
    { key: 2, uuid: 2, content: '完成相关保司资料整理；' },
    { key: 3, uuid: 3, content: '完成PPT场景修改；' },
    { key: 4, uuid: 4, content: '完成结算负责人培训；' },
    { key: 5, uuid: 5, content: '完成培训跟进；' },
  ];
}

function getDaysData(): DayContent[] {
  return [
    {
      fatherId: 1,
      dayOfTarget: 0,
      dayOfMonth: 9,
      plannedProgress: 20,
      actualProgress: 15,
      score: 8,
    },
    {
      fatherId: 1,
      dayOfTarget: 1,
      dayOfMonth: 10,
      plannedProgress: 40,
      actualProgress: 40,
      score: 7,
    },
    {
      fatherId: 1,
      dayOfTarget: 2,
      dayOfMonth: 11,
      plannedProgress: 50,
      actualProgress: 50,
      score: 7,
    },
    {
      fatherId: 1,
      dayOfTarget: 3,
      dayOfMonth: 12,
      plannedProgress: 60,
      actualProgress: 65,
      score: 8,
    },
    {
      fatherId: 1,
      dayOfTarget: 4,
      dayOfMonth: 13,
      plannedProgress: 75,
      actualProgress: 80,
      score: 9,
    },
    {
      fatherId: 1,
      dayOfTarget: 5,
      dayOfMonth: 14,
      plannedProgress: 100,
      actualProgress: 100,
      score: 9,
    },
    {
      fatherId: 1,
      dayOfTarget: 6,
      dayOfMonth: 15,
      plannedProgress: 100,
      actualProgress: 100,
      score: 0,
    },
  ];
}

export default function WeeklyWork() {
  // true-收起；false-展开
  const [fold, setFold] = useState(true);
  const toggleFold = () => {
    setFold(!fold);
  };
  return (
    <div>
      {getWorks().map((work) => {
        return (
          <Row key={work.id}>
            <Col span={5}>
              <Head headParam={work} />
            </Col>
            <Col span={12} className={styles.stepCol}>
              <Row>
                <Col span={23}>
                  <Steps stepContents={getSteps()} />
                </Col>
                <Col span={1} className={styles.myIconCol}>
                  <FastBackwardOutlined className={styles.myIconJump} />
                  <br />
                  <FastForwardOutlined className={styles.myIconJump} />
                  <br />
                  <ExportOutlined className={styles.myIconContinue} />
                  <br />
                  {fold ? (
                    <FullscreenOutlined onClick={toggleFold} className={styles.myIconFold} />
                  ) : (
                    <FullscreenExitOutlined onClick={toggleFold} className={styles.myIconFold} />
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={7}>
              <DayRecords dayRecords={getDaysData()} />
            </Col>
          </Row>
        );
      })}
    </div>
  );
}
