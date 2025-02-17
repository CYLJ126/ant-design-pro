import React from 'react';
import Steps from './steps';
import DayRecords, { DayContent } from './dayRecords';
import HeadInfo, { HeadContent } from './headInfo';
import HeaderButtons from './headerButtons';
import HeaderDate from './HeaderDate';
import { Col, Row } from 'antd';
// 图标依次为：跳转到每日计划，跳转到每月计划，展开，收起，事项推迟到下周
import styles from './index.less';

function getWeekInfo() {
  return [
    { dayOfWeek: 1, dayOfDate: '02/17' },
    { dayOfWeek: 2, dayOfDate: '02/18' },
    { dayOfWeek: 3, dayOfDate: '02/19' },
    { dayOfWeek: 4, dayOfDate: '02/20' },
    { dayOfWeek: 5, dayOfDate: '02/21' },
    { dayOfWeek: 6, dayOfDate: '02/22' },
    { dayOfWeek: 7, dayOfDate: '02/23' },
  ];
}

function getWeekStatistics() {
  return {
    weekId: 9,
    score: 8.5,
    completed: 3,
    overdue: 1,
    todo: 5,
  };
}

function getWorks(): HeadContent[] {
  return [
    {
      id: 1,
      themeId: 1,
      itemId: 8,
      target: '完成产品场景整理完成产品场景整理',
      score: 8.5,
      proportion: 65,
      startTime: '2025/01/24',
      endTime: '2025/02/24',
    },
    {
      id: 2,
      themeId: 1,
      itemId: 8,
      target: '完成产品场景整理',
      score: 8.5,
      proportion: 65,
      startTime: '2025/01/24',
      endTime: '2025/02/24',
    },
    {
      id: 3,
      themeId: 1,
      itemId: 8,
      target: '完成产品场景整理',
      score: 8.5,
      proportion: 65,
      startTime: '2025/01/24',
      endTime: '2025/02/24',
    },
    {
      id: 4,
      themeId: 1,
      itemId: 8,
      target: '完成产品场景整理',
      score: 8.5,
      proportion: 65,
      startTime: '2025/01/24',
      endTime: '2025/02/24',
    },
    {
      id: 5,
      themeId: 1,
      itemId: 8,
      target: '完成产品场景整理',
      score: 8.5,
      proportion: 65,
      startTime: '2025/01/24',
      endTime: '2025/02/24',
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

function addItem() {
  console.log('添加新项');
}

export default function WeeklyWork() {
  return (
    <div>
      <Row>
        <Col span={17}>
          <HeaderButtons weekInfo={getWeekStatistics()} addItem={addItem} />
        </Col>
        <Col span={7}>
          <HeaderDate week={getWeekInfo()} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      {getWorks().map((work) => {
        return (
          <Row key={work.id}>
            <Col span={5}>
              <HeadInfo headParam={work} />
            </Col>
            <Col span={12} className={styles.stepCol}>
              <Steps stepContents={getSteps()} />
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
