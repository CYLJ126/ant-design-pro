import React from 'react';
import { Input } from 'antd';
import styles from './headerDate.less';

function Day(day) {
  return (
    <div>
      <Input value={day.dayOfWeek} className={styles.dayOfWeek} />
      <br />
      <Input value={day.dayOfDate} className={styles.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ week }) {
  return (
    <div>
      {week.map((item) => (
        <Day key={item.dayOfWeek} day={item} />
      ))}
    </div>
  );
}
