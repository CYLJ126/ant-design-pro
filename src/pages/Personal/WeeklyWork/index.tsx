import React, { useEffect, useState } from 'react';
import Steps from './steps';
import DayRecords from './dayRecords';
import TargetInfo from './TargetInfo';
import HeaderButtons from './headerButtons';
import HeaderDate from './HeaderDate';
import { Col, Row } from 'antd';
// 图标依次为：跳转到每日计划，跳转到每月计划，展开，收起，事项推迟到下周
import styles from './index.less';
import { getWhichWeek } from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import { useModel } from 'umi';

export default function WeeklyWork() {
  const [whichWeek, setWhichWeek] = useState(0);
  const { targets, addNewTarget, updateTarget, initialTargets } = useModel('targetsModel');
  dayjs.extend(utc);

  /**
   * 切换周 ID
   * @param type 类型：former-往前切换一周；latter-往后切换一周；
   */
  function toggleWeek(type) {
    const delta = type === 'former' ? -1 : 1;
    let newVar = whichWeek + delta;
    setWhichWeek(newVar);
    // 加载本周目标列表
    initialTargets(newVar);
  }

  useEffect(() => {
    let date = dayjs().utc().local().format('YYYY-MM-DD');
    getWhichWeek(date).then((result) => {
      setWhichWeek(result);
      // 加载本周目标列表
      initialTargets(result);
    });
  }, []);

  // 目标列表高度 = 窗口高度 - 表头高度（43） - 分隔线（15）
  const targetsHeight = window.innerHeight - 43 - 15 - 70 + 'px';
  const time = new Date().getTime();
  return (
    <div className={styles.wrapper}>
      <Row wrap={false}>
        <Col flex={'auto'}>
          <HeaderButtons whichWeek={whichWeek} addTarget={addNewTarget} toggleWeek={toggleWeek} />
        </Col>
        <Col style={{ width: 385, flex: '0 0 auto', minWidth: 385 }}>
          <HeaderDate whichWeek={whichWeek} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      <div style={{ height: targetsHeight }}>
        {Object.keys(targets).length !== 0 &&
          Object.keys(targets).map((field) => {
            const id = targets[field].id;
            return (
              <Row key={id + '_' + time}>
                <Col flex="1">
                  <TargetInfo
                    targetId={id}
                    saveHead={(param) => {
                      if (!param.workId || !param.target) {
                        console.log('事项 ID 或目标描述为空');
                        return;
                      }
                      updateTarget(param);
                    }}
                  />
                </Col>
                <Col flex="2" className={styles.stepCol}>
                  <Steps targetId={id} />
                </Col>
                <Col style={{ width: 385, flex: '0 0 auto', minWidth: 385 }}>
                  <DayRecords targetId={id} weekId={whichWeek} />
                </Col>
              </Row>
            );
          })}
      </div>
    </div>
  );
}
