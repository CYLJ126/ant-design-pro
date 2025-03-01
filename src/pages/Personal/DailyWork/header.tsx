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

export default function Header({ add, toggleDay }) {
  return (
    <div>
      <Row>
        <VerticalRightOutlined className={styles.forwardWeek} onClick={() => toggleDay('former')} />
        <span className={styles.whichDay}>2025/02/25</span>
        <VerticalLeftOutlined className={styles.forwardWeek} onClick={() => toggleDay('latter')} />
        <StepBackwardOutlined className={styles.fold} />
        <StepForwardOutlined className={styles.fold} />
        <PlusSquareOutlined className={styles.plusItem} onClick={add} />
        <ExportOutlined className={styles.toWeekly} />
      </Row>
    </div>
  );
}
