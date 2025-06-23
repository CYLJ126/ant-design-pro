import React from 'react';
import { PlusSquareOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './headerButtons.less';
import { useStickyNoteData } from '@/pages/Personal/StickyNote/StickyNoteContext';

export default function Summary() {
  const { listIds, addBlankOne } = useStickyNoteData();
  return (
    <div>
      {/* 添加新便笺 */}
      <PlusSquareOutlined className={styles.plusItem} onClick={addBlankOne} />
      {/* 刷新便笺列表 */}
      <ReloadOutlined className={styles.refresh} onClick={listIds} />
      <hr className={styles.headerLine} />
    </div>
  );
}
