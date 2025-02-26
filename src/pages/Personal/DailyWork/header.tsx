import React from 'react';
import { Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import styles from './header.less';

export default function Header() {
  return (
    <div>
      <Row>
        <span className={styles.whichDay}>2025/02/25</span>
        <StepBackwardOutlined className={styles.fold} />
        <StepForwardOutlined className={styles.fold} />
        <PlusSquareOutlined className={styles.plusItem} />
        <ExportOutlined className={styles.toWeekly} />
      </Row>
    </div>
  );
}
