import React from 'react';
import { BellOutlined } from '@ant-design/icons';
import styles from './MenuSlot.less';

export function MenuSlot() {
  return (
    <div>
      <BellOutlined className={styles.icon} />
      <br />
    </div>
  );
}
