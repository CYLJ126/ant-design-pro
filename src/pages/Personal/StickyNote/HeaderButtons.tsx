import React from 'react';
import { PlusSquareOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './headerButtons.less';

export default function Summary() {
  return (
    <div>
      {/* 添加新便笺 */}
      <PlusSquareOutlined className={styles.plusItem} />
      {/* 刷新便笺列表 */}
      <ReloadOutlined className={styles.refresh} />
      <hr className={styles.headerLine} />
    </div>
  );
}
