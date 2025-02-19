import React from 'react';
import { Input, Row } from 'antd';
import styles from './headerDate.less';

function Day({ day }) {
  return (
    <div style={{ marginRight: '5px' }}>
      <Input value={day.dayOfWeek} className={styles.dayOfWeek} />
      <br />
      <Input value={day.dayOfDate} className={styles.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ weekDays }) {
  return (
    <Row>
      {weekDays.map((item) => (
        <Day day={item} key={item.dayOfWeek} />
      ))}
    </Row>
  );
}
