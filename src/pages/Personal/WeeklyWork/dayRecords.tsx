import React, { useState } from 'react';
import { Col, InputNumber, Row } from 'antd';
import styles from './index.less';

export interface DayContent {
  fatherId: number;
  dayOfTarget: number;
  dayOfMonth: number;
  plannedProgress: number;
  actualProgress: number;
  score: number;
}

function save(record) {
  console.log('数据：' + JSON.stringify(record));
}

function Day({ recordParam }) {
  const [record, setRecord] = useState(recordParam);

  return (
    <>
      <InputNumber
        className={styles.dayProgress}
        min={0}
        max={100}
        value={record.plannedProgress}
        onChange={(value) => setRecord({ ...record, plannedProgress: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
      <InputNumber
        className={styles.dayProgress}
        value={record.actualProgress}
        onChange={(value) => setRecord({ ...record, actualProgress: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
      <InputNumber
        className={styles.dayProgress}
        value={record.score}
        onChange={(value) => setRecord({ ...record, score: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
    </>
  );
}

export default function DayRecords({ dayRecords }) {
  return (
    <Row>
      {dayRecords
        .sort((a, b) => a.dayOfTarget < b.dayOfTarget)
        .map((day) => (
          <Col span={3} key={day.uuid}>
            <Day recordParam={day} className={styles.dayProgress} />
          </Col>
        ))}
    </Row>
  );
}
