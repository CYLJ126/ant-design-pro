import React from 'react';
import { Row } from 'antd';
import {
  BarChartOutlined,
  PlusSquareOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './headerButtons.less';
import { createStyles } from 'antd-style';

/**
 * 占比在不足时，显示绿色，等于100时显示蓝色，超过100时显示红色；
 * @param proportion 占比
 */
const useProportionStyle = (proportion) => {
  let color;
  if (proportion < 100) {
    color = '#63bd89';
  } else if (proportion > 100) {
    color = '#ff0000';
  } else {
    color = '#81d3f8';
  }
  return createStyles(({ css }) => ({
    proportion: css`
      border: 1.5px solid ${color};
      color: ${color};
      width: 58px;
      height: 30px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
      padding: 5px;
      margin-right: 8px;
      margin-top: 10px;
    `,
  }))();
};

/**
 * 显示周统计和周总结
 */
function showWeeklyStatistics() {
  console.log('周统计');
}

export default function HeaderButtons({ weekInfo, addTarget, toggleWeek }) {
  const { styles: proportionStyle } = useProportionStyle(weekInfo.proportion);
  return (
    <Row>
      <VerticalRightOutlined className={styles.forwardWeek} onClick={() => toggleWeek('former')} />
      <span className={styles.whichWeek}>{'第' + weekInfo.aimId + '周'}</span>
      <VerticalLeftOutlined className={styles.forwardWeek} onClick={() => toggleWeek('latter')} />
      <span className={styles.weeklyScore}>{'' + weekInfo.score + '分'}</span>
      <span className={proportionStyle.proportion}>{'' + weekInfo.proportion + '%'}</span>
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
