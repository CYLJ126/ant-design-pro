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
  addTarget,
  deleteTarget,
  getTargets,
  getWhichWeek,
  updateWeeklyWork,
} from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import KeepAlive from 'react-activation';
import HeadInfoFold from './headInfoFold';

export function saveHead(param, postUpdate) {
  console.log('保存内容：' + JSON.stringify(param));
  if (!param.workId || !param.target) {
    console.log('事项 ID 或目标描述为空');
    return;
  }
  const headInfo = {
    id: param.id,
    themeId: param.themeId,
    workId: param.workId,
    orderId: param.orderId,
    target: param.target,
    foldFlag: param.foldFlag,
    proportion: param.proportion,
    startDate: param.startDate,
    endDate: param.endDate,
  };
  updateWeeklyWork(headInfo).then(() => postUpdate());
}

function WeeklyWork() {
  const [whichWeek, setWhichWeek] = useState(0);
  const [targets, setTargets] = useState([]);
  dayjs.extend(utc);

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
    // 刷新表头——周统计信息 TODO
    // 更新目标列表
    getTargets({ weekId: whichWeek }).then((result) => {
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
    let date = dayjs().utc().local().format('YYYY-MM-DD');
    getWhichWeek(date).then((result) => {
      setWhichWeek(result);
    });
  }, []);

  useEffect(() => {
    if (whichWeek !== 0) {
      // 加载本周目标列表
      getTargets({ weekId: whichWeek }).then((result) => {
        setTargets(result);
      });
    }
  }, [whichWeek]);

  function foldWeeklyWork(target, type) {
    saveHead({ ...target, foldFlag: type }, () => {});
    const newTargets = targets.map((item) => {
      if (item.id === target.id) {
        item.foldFlag = type;
      }
      return item;
    });
    setTargets(newTargets);
  }

  // 目标列表高度 = 窗口高度 - 表头高度（43） - 分隔线（15）
  const targetsHeight = window.innerHeight - 43 - 15 - 70 + 'px';

  return (
    <div>
      <Row>
        <Col span={17}>
          <HeaderButtons whichWeek={whichWeek} addTarget={addNewTarget} toggleWeek={toggleWeek} />
        </Col>
        <Col span={7}>
          <HeaderDate whichWeek={whichWeek} />
        </Col>
      </Row>
      <hr className={styles.headerLine} />
      <div className={styles.weeklyData} style={{ height: targetsHeight }}>
        {targets.map((target) => {
          return (
            <Row key={target.id}>
              <Col span={5}>
                {target.foldFlag === 'YES' ? (
                  <HeadInfo
                    headParam={target}
                    saveHead={saveHead}
                    postUpdate={afterPartialUpdate}
                  />
                ) : (
                  <HeadInfoFold
                    headParam={target}
                    saveHead={saveHead}
                    postUpdate={afterPartialUpdate}
                  />
                )}
              </Col>
              <Col span={12} className={styles.stepCol}>
                <Steps
                  target={target}
                  deleteTarget={deleteOneTarget}
                  foldWeeklyWork={foldWeeklyWork}
                />
              </Col>
              <Col span={7}>
                <DayRecords target={target} weekId={whichWeek} />
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
}

export default () => {
  return (
    <KeepAlive name="weeklyWork">
      <WeeklyWork />
    </KeepAlive>
  );
};
