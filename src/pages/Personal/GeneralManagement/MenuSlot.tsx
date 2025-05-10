import React from 'react';
import { BellOutlined } from '@ant-design/icons';
import styles from './MenuSlot.less';

export function MenuSlot({ handleSwitch }) {
  return (
    <div>
      <BellOutlined className={styles.icon} onClick={() => handleSwitch('todo')} />
      <br />
    </div>
  );
}
