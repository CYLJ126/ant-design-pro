import React from 'react';
import { Row } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './headerButtons.less';

/**
 * 显示周统计和周总结
 */
function showWeeklyStatistics() {
  console.log('周统计');
}

export default function HeaderButtons({ weekInfo, addTarget, toggleWeek }) {
  let color;
  if (weekInfo.proportion < 100) {
    color = '#63bd89';
  } else if (weekInfo.proportion > 100) {
    color = '#ff0000';
  } else {
    color = '#81d3f8';
  }
  return (
    <Row>
      <VerticalRightOutlined className={styles.forwardWeek} onClick={() => toggleWeek('former')} />
      <span className={styles.whichWeek}>{'第' + weekInfo.aimId + '周'}</span>
      <VerticalLeftOutlined className={styles.forwardWeek} onClick={() => toggleWeek('latter')} />
      <span className={styles.weeklyScore}>{'' + weekInfo.score + '分'}</span>
      <span
        key={new Date().getTime()}
        className={styles.proportion}
        style={{
          color: color,
          border: `1.5px solid ${color}`,
        }}
      >
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
      <PlusSquareOutlined onClick={addTarget} className={styles.plusItem} />
      <BarChartOutlined onClick={showWeeklyStatistics} className={styles.statistics} />
    </Row>
  );
}
