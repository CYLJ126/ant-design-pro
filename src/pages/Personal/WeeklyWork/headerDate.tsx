import React from 'react';
import { Input, Row } from 'antd';
import styles from './headerDate.less';

function Day({ day }) {
  return (
    <div style={{ marginRight: '5px' }}>
      <Input value={day.week} className={styles.dayOfWeek} />
      <br />
      <Input value={day.month + '/' + day.day} className={styles.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ weekDays }) {
  return (
    <Row>
      {weekDays.map((day) => (
        <Day day={day} key={day.day} />
      ))}
    </Row>
  );
}
