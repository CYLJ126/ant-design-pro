import React, { useEffect, useRef, useState } from 'react';
import Steps from './steps';
import DayRecords from './dayRecords';
import HeadInfo from './headInfo';
import HeaderButtons from './headerButtons';
import HeaderDate from './HeaderDate';
import { Col, Row } from 'antd';
// 图标依次为：跳转到每日计划，跳转到每月计划，展开，收起，事项推迟到下周
import styles from './index.less';
import {
  addWork,
  deleteWork,
  getCurrentWeekWorks,
  getWeekDays,
  getWeekStatistics,
} from '@/services/ant-design-pro/dailyWork';

export default function WeeklyWork() {
  const [weekDays, setWeekDays] = useState([]);
  const [works, setWorks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const stepsRef = useRef(null);

  function addNewWork() {
    console.log('添加新项');
    let newWorks = [];
    addWork().then((result) => {
      if (result) {
        newWorks.push(result);
        works.map((item) => newWorks.push(item));
        setWorks(newWorks);
        // 移动到最上方
        stepsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function deleteOneWork(workId) {
    console.log('删除事项：' + workId);
    deleteWork(workId).then((result) => {
      if (result) {
        let newWorks = [];
        works.forEach((item) => {
          if (item.id !== workId) {
            newWorks.push(item);
          }
        });
        setWorks(newWorks);
      }
    });
  }

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
          <HeaderButtons weekInfo={statistics} addWork={addNewWork} />
        </Col>
        <Col span={7}>
          <HeaderDate weekDays={weekDays} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      <div ref={stepsRef} className={styles.weeklyData} style={{ height: worksHeight }}>
        {works.map((work) => {
          return (
            <Row key={work.id}>
              <Col span={5}>
                <HeadInfo headParam={work} />
              </Col>
              <Col span={12} className={styles.stepCol}>
                <Steps workId={work.id} deleteWork={deleteOneWork} />
              </Col>
              <Col span={7}>
                <DayRecords workId={work.id} />
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
