import React, { useEffect, useState } from 'react';
import { InputNumber, Row } from 'antd';
import styles from './dayRecords.less';
import { getDaysData, updateDayData } from '@/services/ant-design-pro/dailyWork';

export interface DayContent {
  id: number;
  targetId: number;
  dayOfTarget: number;
  dayOfMonth: number;
  plannedProgress: number;
  actualProgress: number;
  score: number;
}

function save(record) {
  console.log('日期数据：' + JSON.stringify(record));
  updateDayData(record).then();
}

function Day({ recordParam }) {
  const [record, setRecord] = useState(recordParam);

  return (
    <div>
      <InputNumber
        step={5}
        min={0}
        max={100}
        changeOnWheel={true}
        addonAfter="%"
        value={record.plannedProgress}
        onChange={(value) => setRecord({ ...record, plannedProgress: value })}
        onBlur={() => save(record)}
      />
      <br />
      <InputNumber
        step={5}
        min={0}
        max={100}
        changeOnWheel={true}
        addonAfter="%"
        value={record.actualProgress}
        onChange={(value) => setRecord({ ...record, actualProgress: value })}
        onBlur={() => save(record)}
      />
      <br />
      <InputNumber
        step={1}
        min={0}
        max={10}
        changeOnWheel={true}
        addonAfter="分"
        value={record.score}
        onChange={(value) => setRecord({ ...record, score: value })}
        onBlur={() => save(record)}
      />
      <br />
    </div>
  );
}

export default function DayRecords({ targetId: targetId }) {
  const [dayRecords, setDayRecords] = useState([]);

  useEffect(() => {
    getDaysData(targetId).then((result) => {
      setDayRecords(result);
    });
  }, [targetId]);

  return (
    <Row className={styles.dayProgress}>
      {dayRecords
        .sort((a, b) => a.dayOfTarget - b.dayOfTarget)
        .map((day) => (
          <Day key={day.id} recordParam={day} />
        ))}
    </Row>
  );
}
