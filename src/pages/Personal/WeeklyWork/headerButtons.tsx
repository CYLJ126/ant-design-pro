import React from 'react';
import { Row } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import headerButtonsStyle from './headerButtonsStyle';

/**
 * 显示周统计和周总结
 */
function showWeeklyStatistics() {
  console.log('周统计');
}

export default function HeaderButtons({ weekInfo, addTarget, toggleWeek }) {
  const { styles: dynamicStyle } = headerButtonsStyle(weekInfo);
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
      <PlusSquareOutlined onClick={addTarget} className={dynamicStyle.plusItem} />
      {/* 周统计数据 */}
      <BarChartOutlined onClick={showWeeklyStatistics} className={dynamicStyle.statistics} />
      <ReloadOutlined onClick={showWeeklyStatistics} className={dynamicStyle.refresh} />
    </Row>
  );
}
