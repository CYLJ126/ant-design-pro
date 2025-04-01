import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import headerButtonsStyle from './headerButtonsStyle';
import { getWeekStatistics, updateWeeklyStatistics } from '@/services/ant-design-pro/dailyWork';
import { useModel } from '@@/exports';

export default function HeaderButtons({ whichWeek, toggleWeek }) {
  const [weekInfo, setWeekInfo] = useState({
    aimId: whichWeek,
    score: 0,
    proportion: 0,
    completedWork: 0,
    todoWork: 0,
    overdueWork: 0,
  });
  const { styles: dynamicStyle } = headerButtonsStyle(weekInfo);
  const { addNewTarget } = useModel('targetsModel');
  const { weeklyStatistics } = useModel('weeklyStatisticsModel');

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
  }

  useEffect(() => {
    // 加载表头——周统计信息
    getWeekStatistics(whichWeek).then((result) => setWeekInfo({ ...result, aimId: whichWeek }));
  }, [whichWeek, weeklyStatistics]);

  return (
    <Row>
      {/* 向前一周 */}
      <VerticalRightOutlined
        className={dynamicStyle.forwardWeek}
        onClick={() => toggleWeek('former')}
      />
      <span className={dynamicStyle.whichWeek}>{'第' + weekInfo.aimId + '周'}</span>
      {/* 向后一周 */}
      <VerticalLeftOutlined
        className={dynamicStyle.forwardWeek}
        onClick={() => toggleWeek('latter')}
      />
      <span className={dynamicStyle.weeklyScore}>{'' + weekInfo.score + '分'}</span>
      <span key={new Date().getTime()} className={dynamicStyle.proportion}>
        {'' + weekInfo.proportion + '%'}
      </span>
      <span className={`${dynamicStyle.itemCount} ${dynamicStyle.completedItems}`}>
        {'完成项 - ' + weekInfo.completedWork}
      </span>
      <span className={`${dynamicStyle.itemCount} ${dynamicStyle.todoItems}`}>
        {'待办项 - ' + weekInfo.todoWork}
      </span>
      <span className={`${dynamicStyle.itemCount} ${dynamicStyle.overdueItems}`}>
        {'逾期项 - ' + weekInfo.overdueWork}
      </span>
      {/* 添加新目标 */}
      <PlusSquareOutlined
        onClick={() => addNewTarget(whichWeek)}
        className={dynamicStyle.plusItem}
      />
      {/* 周统计数据 */}
      <BarChartOutlined
        onClick={() => showWeeklyStatistics(whichWeek)}
        className={dynamicStyle.statistics}
      />
      <ReloadOutlined
        onClick={() => refreshStatistics(whichWeek)}
        className={dynamicStyle.refresh}
      />
    </Row>
  );
}
