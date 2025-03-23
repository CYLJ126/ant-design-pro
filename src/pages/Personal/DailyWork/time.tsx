import timeStyle from './timeStyle';
import React, { useState } from 'react';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import { Col, Row, TimePicker } from 'antd';

export default function Time({ dailyWork, save, showLine }) {
  const { styles: dynamicStyle } = timeStyle(dailyWork.status);
  const [date, setDate] = useState(dayjs(dailyWork[dailyWork.mark]).utc().local());
  dayjs.extend(utc);
  return (
    <Row>
      <Col span={showLine ? 8 : 0}>
        <hr className={dynamicStyle.line} />
      </Col>
      <Col span={showLine ? 16 : 24}>
        <TimePicker
          value={date}
          format="HH:mm"
          className={dynamicStyle.time}
          placeholder={dailyWork.placeholder}
          onChange={(time, timeString) => {
            let temp = { ...dailyWork };
            const dateStr = dayjs(dailyWork.startTime).utc().local().format('YYYY-MM-DD');
            if (dailyWork.mark === 'startTime') {
              temp.startTimeStr = dateStr + ' ' + timeString + ':00';
              temp.endTimeStr =
                dateStr + ' ' + dayjs(dailyWork.endTime).utc().local().format('HH:mm:ss');
            } else {
              temp.endTimeStr = dateStr + ' ' + timeString + ':59';
              temp.startTimeStr =
                dateStr + ' ' + dayjs(dailyWork.startTime).utc().local().format('HH:mm:ss');
            }
            setDate(time);
            save(temp);
          }}
        />
      </Col>
    </Row>
  );
}
