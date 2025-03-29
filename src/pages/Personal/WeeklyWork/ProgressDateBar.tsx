import React from 'react';
import { DatePicker, Progress, Row } from 'antd';
import styles from './ProgressDateBar.less';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';

export default function ProgressDateBar({ target, onChangeFunc }) {
  dayjs.extend(utc);

  return (
    <Row>
      <div className={styles.dateAndProgress}>
        <Progress
          percent={target.progress}
          showInfo={false}
          strokeColor="#81d3f8"
          trailColor="#c6c6c6"
          className={styles.progress}
        />
        <DatePicker.RangePicker
          className={styles.date}
          placeholder={['开始', '结束']}
          format="MM/DD"
          defaultValue={[
            dayjs(target.startDate, 'YYYY/MM/DD'),
            dayjs(target.endDate, 'YYYY/MM/DD'),
          ]}
          onChange={(date) => {
            const temp = {
              ...target,
              startDate: dayjs(date[0]).utc().local().format('YYYY-MM-DD'),
              endDate: dayjs(date[1]).utc().local().format('YYYY-MM-DD'),
            };
            onChangeFunc(temp);
          }}
        />
      </div>
    </Row>
  );
}
