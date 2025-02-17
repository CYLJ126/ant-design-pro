import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import styles from './headerDate.less';
import { getDaysData } from '@/services/ant-design-pro/dailyWork';

function Day(day) {
  return (
    <div>
      <Input value={day.dayOfWeek} className={styles.dayOfWeek} />
      <br />
      <Input value={day.dayOfDate} className={styles.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ weekId }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    getDaysData(weekId).then((result) => {
      setDays(result);
    });
  }, [weekId]);
  return (
    <div>
      {days.map((item) => (
        <Day key={item.dayOfWeek} day={item} />
      ))}
    </div>
  );
}
