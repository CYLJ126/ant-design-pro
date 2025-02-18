import React from 'react';
import { Row } from 'antd';
import { BarChartOutlined, PlusSquareOutlined } from '@ant-design/icons';
import styles from './headerButtons.less';

/**
 * 显示周统计和周总结
 */
function showWeeklyStatistics() {}

export default function HeaderButtons({ weekInfo, addItem }) {
  return (
    <Row>
      <span className={styles.whichWeek}>{'第' + weekInfo.weekId + '周'}</span>
      <span className={styles.weeklyScore}>{'' + weekInfo.score + '分'}</span>
      <span className={`${styles.itemCount} ${styles.completedItems}`}>
        {'完成项 - ' + weekInfo.completed}
      </span>
      <span className={`${styles.itemCount} ${styles.todoItems}`}>
        {'待办项 - ' + weekInfo.todo}
      </span>
      <span className={`${styles.itemCount} ${styles.overdueItems}`}>
        {'逾期项 - ' + weekInfo.overdue}
      </span>
      <PlusSquareOutlined onClick={addItem} className={styles.plusItem} />
      <BarChartOutlined onClick={showWeeklyStatistics} className={styles.statistics} />
    </Row>
  );
}
