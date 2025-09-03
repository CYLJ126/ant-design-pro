import React from 'react';
import {
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './headerButtons.less';
import { useStickyNoteData } from '@/pages/Personal/StickyNote/StickyNoteContext';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD';

export default function Summary() {
  const { whichDay, setWhichDay, list, addBlankOne } = useStickyNoteData();

  // 日期切换
  const toggleDay = (type, value) => {
    let newDay;
    if (type === 'set') {
      // 直接切换到指定日期
      newDay = value.toDate();
    } else {
      // 往前推一天或往后推一天
      let temp = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate());
      temp.setDate(whichDay.getDate() + (type === 'former' ? -1 : 1));
      newDay = temp;
    }
    setWhichDay(newDay);
    list({ endDate: newDay });
  };

  return (
    <div>
      {/* 向前一天 */}
      <VerticalRightOutlined
        className={styles.switchDay}
        onClick={() => toggleDay('former', null)}
      />
      {/* 当前日期 */}
      <DatePicker
        className={styles.date}
        value={dayjs(whichDay)}
        format={dateFormat}
        onChange={(date) => {
          toggleDay('set', date);
        }}
      />
      {/* 向后一天 */}
      <VerticalLeftOutlined
        className={styles.switchDay}
        onClick={() => toggleDay('latter', null)}
      />
      {/* 添加新便笺 */}
      <PlusSquareOutlined className={styles.plusItem} onClick={addBlankOne} />
      {/* 刷新便笺列表 */}
      <ReloadOutlined className={styles.refresh} onClick={list} />
      <hr className={styles.headerLine} />
    </div>
  );
}
