import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './headerButtons.less';
import { getWeekStatistics, updateWeeklyStatistics } from '@/services/ant-design-pro/dailyWork';
import { useModel } from 'umi';

export default function HeaderButtons({ whichWeek, toggleWeek }) {
  const [weekInfo, setWeekInfo] = useState({
    aimId: whichWeek,
    score: 0,
    proportion: 0,
    completedWork: 0,
    todoWork: 0,
    overdueWork: 0,
  });
  const { addNewTarget, initialTargets } = useModel('targetsModel');
  const { updateInfo: targetChangeTip } = useModel('targetUpdateModel');

  /**
   * 显示周统计和周总结
   */
  function showWeeklyStatistics(whichWeek) {
    console.log('周统计: ' + whichWeek);
  }

  /**
   * 刷新周统计数据
   */
  function refreshStatistics(whichWeek) {
    updateWeeklyStatistics(whichWeek).then((result) => setWeekInfo(result));
    initialTargets(whichWeek).then();
  }

  useEffect(() => {
    // 加载表头——周统计信息
    getWeekStatistics(whichWeek).then((result) => setWeekInfo({ ...result, aimId: whichWeek }));
  }, [whichWeek, targetChangeTip]);

  useEffect(() => {
    // 加载表头——周统计信息
    if (weekInfo.proportion > 100) {
      document.documentElement.style.setProperty('--proportion-color', '#ff0000');
    } else if (weekInfo.proportion === 100) {
      document.documentElement.style.setProperty('--proportion-color', '#5bb1c9');
    } else {
      document.documentElement.style.setProperty('--proportion-color', '#81d3f8');
    }
  }, [weekInfo.proportion]);

  return (
    <Row>
      {/* 向前一周 */}
      <VerticalRightOutlined className={styles.forwardWeek} onClick={() => toggleWeek('former')} />
      <span className={styles.whichWeek}>{'第' + weekInfo.aimId + '周'}</span>
      {/* 向后一周 */}
      <VerticalLeftOutlined className={styles.forwardWeek} onClick={() => toggleWeek('latter')} />
      {/* 得分 */}
      <span className={styles.weeklyScore}>{'' + weekInfo.score + '分'}</span>
      {/* 占比 */}
      <span key={new Date().getTime()} className={styles.proportion}>
        {'' + weekInfo.proportion + '%'}
      </span>
      <span className={`${styles.itemCount} ${styles.completedItems}`}>
        {'完成项 - ' + weekInfo.completedWork}
      </span>
      <span className={`${styles.itemCount} ${styles.todoItems}`}>
        {'待办项 - ' + weekInfo.todoWork}
      </span>
      <span className={`${styles.itemCount} ${styles.overdueItems}`}>
        {'逾期项 - ' + weekInfo.overdueWork}
      </span>
      {/* 添加新目标 */}
      <PlusSquareOutlined onClick={() => addNewTarget(whichWeek)} className={styles.plusItem} />
      {/* 周统计数据 */}
      <BarChartOutlined
        onClick={() => showWeeklyStatistics(whichWeek)}
        className={styles.statistics}
      />
      {/* 刷新数据 */}
      <ReloadOutlined onClick={() => refreshStatistics(whichWeek)} className={styles.refresh} />
    </Row>
  );
}
