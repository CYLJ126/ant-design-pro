import React from 'react';
import { Input } from 'antd';
import { PlusSquareOutlined, BarChartOutlined } from '@ant-design/icons';
import styles from './headerButtons.less';

/**
 * 显示周统计和周总结
 */
function showWeeklyStatistics() {}

export default function HeaderButtons({ weekInfo, addItem }) {
  return (
    <div>
      <Input value={'第' + weekInfo.weekId + '周'} className={styles.whichWeek} />
      <Input value={'' + weekInfo.score + '分'} className={styles.weeklyScore} />
      <Input addonBefore="完成项" value={weekInfo.completed} className={styles.completedItems} />
      <Input addonBefore="待办项" value={weekInfo.todo} className={styles.todoItems} />
      <Input addonBefore="逾期项" value={weekInfo.overdue} className={styles.overdueItems} />
      <PlusSquareOutlined onClick={addItem} />
      <BarChartOutlined onClick={showWeeklyStatistics} />
    </div>
  );
}
