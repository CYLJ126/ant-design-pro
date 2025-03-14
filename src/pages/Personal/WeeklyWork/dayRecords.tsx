import React, { useEffect, useState } from 'react';
import { InputNumber, Row } from 'antd';
import styles from './dayRecords.less';
import { listWeekDays, updateDayData } from '@/services/ant-design-pro/dailyWork';
import { createStyles } from 'antd-style';

/**
 * 根据传入颜色，设置每条步骤的颜色
 * @param color 颜色
 */
const useStepStyle = (color) => {
  return createStyles(({ css }) => ({
    partialStyle: css`
      .ant-input-number {
        border: 1.5px solid ${color};
      }

      .ant-input-number-input {
        color: ${color};
      }

      .ant-input-number-group-addon {
        background-color: ${color};
        border: 1.5px solid ${color};
      }

      .ant-input-number-handler-wrap {
        background-color: ${color};
      }
    `,
  }))();
};

export interface DayContent {
  id: number;
  targetId: number;
  dayOfTarget: number;
  dayOfMonth: number;
  plannedProgress: number;
  actualProgress: number;
  score: number;
}

function Day({ recordParam, target, save }) {
  const [record, setRecord] = useState(recordParam);
  const curDate = new Date(record.dayOfMonth);
  let color;
  if (curDate < new Date(target.startDate) || curDate > new Date(target.endDate)) {
    // 如果当前日期不在该目标的日期范围内，显示灰色
    color = '#c6c6c6';
  } else if (curDate < new Date()) {
    // 如果当前日期小于今天，显示绿色
    color = '#5bb1c9';
  } else {
    // 默认显示蓝色
    color = '#81d3f8';
  }
  const { styles: dynamicStyle } = useStepStyle(color);
  return (
    <div>
      <InputNumber
        step={5}
        min={0}
        max={100}
        changeOnWheel={true}
        addonAfter="%"
        className={dynamicStyle.partialStyle}
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
        className={dynamicStyle.partialStyle}
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
        className={dynamicStyle.partialStyle}
        value={record.score}
        onChange={(value) => setRecord({ ...record, score: value })}
        onBlur={() => save(record)}
      />
      <br />
    </div>
  );
}

export default function DayRecords({ target, weekId, postUpdate }) {
  const [dayRecords, setDayRecords] = useState([]);

  function save(record) {
    console.log('日期数据：' + JSON.stringify(record));
    if (record.dayOfTarget > 0) {
      updateDayData(record).then(() => {
        postUpdate();
      });
    }
  }

  useEffect(() => {
    listWeekDays(target.id, weekId).then((result) => {
      setDayRecords(result);
    });
  }, [target, weekId]);

  // 要每次的 ID 都不一样，才能重新渲染，比如调整了目标的开始、截止日期，想要 <Day> 组件显示不同的颜色，则 key 必须加个时间戳
  const timestamp = new Date().getTime();
  return (
    <Row className={styles.dayProgress}>
      {dayRecords.map((day) => (
        <Day key={day.dayOfMonth + timestamp} target={target} recordParam={day} save={save} />
      ))}
    </Row>
  );
}
