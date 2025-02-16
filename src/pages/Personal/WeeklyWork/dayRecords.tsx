import React, { useState } from 'react';
import { InputNumber, Row } from 'antd';
import styles from './dayRecords.less';

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
    <div>
      <InputNumber
        step={5}
        min={0}
        max={100}
        addonAfter="%"
        value={record.plannedProgress}
        onChange={(value) => setRecord({ ...record, plannedProgress: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
      <InputNumber
        step={5}
        min={0}
        max={100}
        addonAfter="%"
        value={record.actualProgress}
        onChange={(value) => setRecord({ ...record, actualProgress: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
      <InputNumber
        step={1}
        min={0}
        max={10}
        addonAfter="分"
        value={record.score}
        onChange={(value) => setRecord({ ...record, score: value })}
        onBlur={() => save(record)}
        onPressEnter={() => save(record)}
      />
      <br />
    </div>
  );
}

export default function DayRecords({ dayRecords }) {
  return (
    <Row className={styles.dayProgress}>
      {dayRecords
        .sort((a, b) => a.dayOfTarget < b.dayOfTarget)
        .map((day) => (
          <Day key={day.uuid} recordParam={day} />
        ))}
    </Row>
  );
}
