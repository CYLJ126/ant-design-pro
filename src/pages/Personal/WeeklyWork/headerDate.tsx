import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import headerDateStyle from './headerDateStyle';
import { getWeekDaysHeader } from '@/services/ant-design-pro/dailyWork';
import styles from './headerDate.less';

function Day({ day }) {
  const { styles: dynamicStyle } = headerDateStyle(day.date);
  return (
    <div className={styles.dayWrapper}>
      <Input value={day.weekday} readOnly className={dynamicStyle.dayOfWeek} />
      <br />
      <Input value={day.month + '/' + day.day} readOnly className={dynamicStyle.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ whichWeek }) {
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    // 加载表头——本周每天对应的日期
    if (whichWeek !== 0) {
      getWeekDaysHeader(whichWeek).then((result) => setWeekDays(result));
    }
  }, [whichWeek]);

  const time = new Date().getTime();
  return (
    <div className={styles.wrap}>
      <div className={styles.outer}>
        {weekDays.map((day) => (
          <Day day={day} key={day.weekday + '_' + time} />
        ))}
      </div>
    </div>
  );
}
