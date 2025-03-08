import React, { useEffect, useState } from 'react';
import { Input, Row } from 'antd';
import headerDateStyle from './headerDateStyle';
import { getWeekDaysHeader } from '@/services/ant-design-pro/dailyWork';

function Day({ day }) {
  const { styles: dynamicStyle } = headerDateStyle(day.date);
  return (
    <div style={{ marginRight: '5px' }}>
      <Input value={day.weekday} className={dynamicStyle.dayOfWeek} />
      <br />
      <Input value={day.month + '/' + day.day} className={dynamicStyle.dayOfDate} />
    </div>
  );
}

export default function HeaderDate({ whichWeek }) {
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    // 加载表头——本周每天对应的日期
    getWeekDaysHeader(whichWeek).then((result) => setWeekDays(result));
  }, [whichWeek]);

  const time = new Date().getTime();
  return (
    <Row>
      {weekDays.map((day) => (
        <Day key={day.weekday + '_' + time} day={day} />
      ))}
    </Row>
  );
}
