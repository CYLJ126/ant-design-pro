import React, { useEffect, useState } from 'react';
import { InputNumber, Row } from 'antd';
import styles from './dayRecords.less';
import { listWeekDays, updateDayData } from '@/services/ant-design-pro/dailyWork';
import { createStyles } from 'antd-style';
import { useModel } from 'umi';

/**
 * 根据传入颜色，设置每条步骤的颜色
 * @param color 颜色
 * @param foldFlag 折叠标记
 */
const useRecordStyle = (color, foldFlag) => {
  const height = foldFlag === 'YES' ? '32px' : '26px';
  const scoreHeight = foldFlag === 'YES' ? '32px' : '22.5px';
  const scorePaddingTop = foldFlag === 'YES' ? '4px' : '0';
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
    foldStyle: css`
      height: ${height};
      margin-bottom: 4px;

      .ant-input-number {
        border: 1.5px solid ${color};
      }

      .ant-input-number-input {
        height: ${height};
        padding: 0;
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
    leftProgress: css`
      width: 25px;
      border: 1.5px solid ${color};
      border-radius: 5px 0 0 5px;
    `,
    rightProgress: css`
      width: 25px;
      border: 1.5px solid ${color};
      border-radius: 0 5px 5px 0;
      border-left: none;
    `,
    scoreStyle: css`
      height: ${scoreHeight};

      .ant-input-number-input-wrap {
        height: ${scoreHeight};
      }

      .ant-input-number-input {
        height: ${scoreHeight};
        padding-top: ${scorePaddingTop};
      }
    `,
  }))();
};

function Day({ recordParam, targetId }) {
  const [record, setRecord] = useState(recordParam);
  const curDate = new Date(record.dayOfMonth);
  const { targets } = useModel('targetsModel');
  const { updateInfo, setUpdateInfo } = useModel('targetUpdateModel');
  const target = targets[targetId];
  const [fold, setFold] = useState(target.foldFlag === 'NO');
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
  const { styles: dynamicStyle } = useRecordStyle(color, target.foldFlag);

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
      setFold(currentFoldFlag);
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
        </>
      ) : (
        <>
          <InputNumber
            step={5}
            min={0}
            max={100}
            changeOnWheel={true}
            className={`${dynamicStyle.foldStyle} ${dynamicStyle.leftProgress}`}
            value={record.plannedProgress}
            onChange={(value) => setRecord({ ...record, plannedProgress: value })}
            onBlur={() => save(record)}
          />
          <InputNumber
            step={5}
            min={0}
            max={100}
            changeOnWheel={true}
            className={`${dynamicStyle.foldStyle} ${dynamicStyle.rightProgress}`}
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
        className={`${dynamicStyle.partialStyle} ${dynamicStyle.scoreStyle}`}
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
