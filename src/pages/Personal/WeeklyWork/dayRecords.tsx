import React, { useEffect, useState } from 'react';
import { InputNumber, Row } from 'antd';
import styles from './dayRecords.less';
import { listWeekDays, updateDayData } from '@/services/ant-design-pro/dailyWork';
import { useModel } from 'umi';

function getColorStyle(curDate, startDate, endDate) {
  if (curDate < new Date(startDate) || curDate > new Date(endDate)) {
    // 如果当前日期不在该目标的日期范围内，显示灰色
    return styles.excludeColor;
  } else if (curDate < new Date()) {
    // 如果当前日期小于今天，显示深蓝色
    return styles.formerColor;
  } else {
    // 默认显示蓝色
    return styles.latterColor;
  }
}

function Day({ recordParam, targetId }) {
  const [record, setRecord] = useState(recordParam);
  const curDate = new Date(record.dayOfMonth);
  const { targets } = useModel('targetsModel');
  const { updateInfo, setUpdateInfo } = useModel('targetUpdateModel');
  const target = targets[targetId];
  const [fold, setFold] = useState(target.foldFlag === 'NO');
  const [colorStyle, setColorStyle] = useState(
    getColorStyle(curDate, target.startDate, target.endDate),
  );

  function save(record) {
    if (record.dayOfTarget > 0) {
      updateDayData(record).then(() => {
        setUpdateInfo({ targetId: targetId, time: new Date(), fold: fold });
      });
    }
  }

  useEffect(() => {
    // 监听折叠按钮的触发，并进行折叠或展开
    const { targetId: currentTargetId, fold: currentFoldFlag } = updateInfo;
    if (currentTargetId === targetId) {
      if (currentFoldFlag !== fold) {
        setFold(currentFoldFlag);
      }
      if (updateInfo.startDate) {
        setColorStyle(getColorStyle(curDate, updateInfo.startDate, updateInfo.endDate));
      }
    }
  }, [updateInfo]);

  return (
    <div style={{ width: '55px' }}>
      {!fold ? (
        <>
          <InputNumber
            step={5}
            min={0}
            max={100}
            changeOnWheel={true}
            addonAfter="%"
            className={`${colorStyle}`}
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
            className={`${colorStyle}`}
            value={record.actualProgress}
            onChange={(value) => setRecord({ ...record, actualProgress: value })}
            onBlur={() => save(record)}
          />
        </>
      ) : (
        <>
          <InputNumber
            step={5}
            min={0}
            max={100}
            changeOnWheel={true}
            className={`${colorStyle} ${styles.leftProgress} ${styles.foldProgress}`}
            value={record.plannedProgress}
            onChange={(value) => setRecord({ ...record, plannedProgress: value })}
            onBlur={() => save(record)}
          />
          <InputNumber
            step={5}
            min={0}
            max={100}
            changeOnWheel={true}
            className={`${colorStyle} ${styles.rightProgress} ${styles.foldProgress}`}
            value={record.actualProgress}
            onChange={(value) => setRecord({ ...record, actualProgress: value })}
            onBlur={() => save(record)}
          />
        </>
      )}

      <br />
      <InputNumber
        step={1}
        min={0}
        max={10}
        changeOnWheel={true}
        addonAfter="分"
        className={`${colorStyle} ${fold ? styles.foldScore : styles.unFoldScore}`}
        value={record.score}
        onChange={(value) => setRecord({ ...record, score: value })}
        onBlur={() => save(record)}
      />
      <br />
    </div>
  );
}

export default function DayRecordsFold({ targetId, weekId }) {
  const [dayRecords, setDayRecords] = useState([]);

  useEffect(() => {
    listWeekDays(targetId, weekId).then((result) => {
      setDayRecords(result);
    });
  }, [targetId, weekId]);

  // 要每次的 ID 都不一样，才能重新渲染，比如调整了目标的开始、截止日期，想要 <Day> 组件显示不同的颜色，则 key 必须加个时间戳
  const timestamp = new Date().getTime();
  return (
    <Row className={styles.dayProgress} style={{ flexFlow: 'nowrap' }}>
      {dayRecords.map((day) => (
        <Day
          key={day.dayOfMonth + timestamp}
          targetId={targetId}
          recordParam={{ ...day, weekId: weekId }}
        />
      ))}
    </Row>
  );
}
