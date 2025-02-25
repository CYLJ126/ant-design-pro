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
  addTarget,
  deleteTarget,
  getTargets,
  getWeekDaysHeader,
  getWeekStatistics,
  getWhichWeek,
} from '@/services/ant-design-pro/dailyWork';

export default function WeeklyWork() {
  const [whichWeek, setWhichWeek] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  const [targets, setTargets] = useState([]);
  const [statistics, setStatistics] = useState({});
  const stepsRef = useRef(null);

  /**
   * 切换周 ID
   * @param type 类型：former-往前切换一周；latter-往后切换一周；
   */
  function toggleWeek(type) {
    const delta = type === 'former' ? -1 : 1;
    setWhichWeek(whichWeek + delta);
  }

  /**
   * 更新完局部数据后需要更新的内容
   */
  function afterPartialUpdate() {
    // 加载表头——周统计信息
    getWeekStatistics(whichWeek).then((result) => setStatistics({ ...result, aimId: whichWeek }));
    // 更新目标列表
    getTargets(whichWeek).then((result) => {
      setTargets(result);
    });
  }

  function addNewTarget() {
    addTarget(whichWeek).then(() => {
      afterPartialUpdate();
    });
  }

  function deleteOneTarget(targetId) {
    deleteTarget({ id: targetId, weekId: whichWeek }).then(() => {
      afterPartialUpdate();
    });
  }

  useEffect(() => {
    getWhichWeek(new Date()).then((result) => {
      setWhichWeek(result);
    });
  }, []);

  useEffect(() => {
    if (whichWeek !== 0) {
      // 加载表头——周统计信息
      getWeekStatistics(whichWeek).then((result) => setStatistics({ ...result, aimId: whichWeek }));
      // 加载表头——本周每天对应的日期
      getWeekDaysHeader(whichWeek).then((result) => setWeekDays(result));
      // 加载本周目标列表
      getTargets(whichWeek).then((result) => {
        setTargets(result);
      });
    }
  }, [whichWeek]);

  // 目标列表高度 = 窗口高度 - 表头高度（43） - 分隔线（15）
  const targetsHeight = window.innerHeight - 43 - 15 - 70 + 'px';

  return (
    <div>
      <Row>
        <Col span={17}>
          <HeaderButtons weekInfo={statistics} addTarget={addNewTarget} toggleWeek={toggleWeek} />
        </Col>
        <Col span={7}>
          <HeaderDate weekDays={weekDays} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      <div ref={stepsRef} className={styles.weeklyData} style={{ height: targetsHeight }}>
        {targets.map((target) => {
          return (
            <Row key={target.id}>
              <Col span={5}>
                <HeadInfo headParam={target} postUpdate={afterPartialUpdate} />
              </Col>
              <Col span={12} className={styles.stepCol}>
                <Steps targetId={target.id} deleteTarget={deleteOneTarget} />
              </Col>
              <Col span={7}>
                <DayRecords
                  targetId={target.id}
                  weekId={whichWeek}
                  postUpdate={afterPartialUpdate}
                />
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
