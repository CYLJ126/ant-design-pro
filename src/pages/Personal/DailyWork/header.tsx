import React from 'react';
import { Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './header.less';
import dayjs from 'dayjs';

export default function Header({ whichDay, add, toggleDay }) {
  return (
    <div>
      <Row>
        <VerticalRightOutlined className={styles.forwardWeek} onClick={() => toggleDay('former')} />
        <span className={styles.whichDay}>
          {dayjs(whichDay ?? new Date()).format('YYYY/MM/DD')}
        </span>
        <VerticalLeftOutlined className={styles.forwardWeek} onClick={() => toggleDay('latter')} />
        <StepBackwardOutlined className={styles.fold} />
        <StepForwardOutlined className={styles.fold} />
        <PlusSquareOutlined className={styles.plusItem} onClick={add} />
        <ExportOutlined className={styles.toWeekly} />
      </Row>
    </div>
  );
}
