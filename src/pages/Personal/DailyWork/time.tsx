import timeStyle from './timeStyle';
import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';
import { Col, Row, TimePicker } from 'antd';

dayjs.extend(utc);

export default function Time({ timeParam, mark, status, save, showLine }) {
  const [dateTime, setDateTime] = useState<Dayjs>(null);
  const { styles: dynamicStyle } = timeStyle(status);

  useEffect(() => {
    setDateTime(timeParam.clone());
  }, [timeParam]);

  return (
    <Row>
      <Col span={showLine ? 8 : 0}>
        <hr className={dynamicStyle.line} />
      </Col>
      <Col span={showLine ? 16 : 24}>
        <TimePicker
          value={dateTime}
          format="HH:mm"
          className={dynamicStyle.time}
          onChange={(temp, timeString) => {
            const dateStr = temp.utc().local().format('YYYY-MM-DD');
            const seconds = mark === 'startTime' ? ':00' : ':59';
            save(dateStr + ' ' + timeString + seconds);
            setDateTime(temp);
          }}
        />
      </Col>
    </Row>
  );
}
