import React, { useEffect, useRef, useState } from 'react';
import { Col, DatePicker, Input, InputNumber, Progress, Row, Select } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import { markDay, updateTrace } from '@/services/ant-design-pro/dailyWork';
import { useTimeTraceData } from './TimeTraceContext';
import styles from './timeTrace.less';
import ThumbsUp from '@/icons/ThumbsUp';
import DeleteIcon from '@/icons/DeleteIcon';

const dateFormat = 'YYYY-MM-DD';

const thumbsColor = (isUp, status) => {
  if (status === 'INITIAL') {
    return '#81d3f8';
  }
  if (isUp) {
    return status === 'DONE' ? '#65be8a' : '#c6c6c6';
  } else {
    return status === 'CLOSED' ? '#f88a22' : '#c6c6c6';
  }
};

export default function TimeTrace({ data }) {
  const { getSubTags, currentDate, themeOptions, foldFlag, deleteOne } = useTimeTraceData();
  let tempTimeTrace = {
    ...data,
    startDate: dayjs(data.startDate),
    endDate: dayjs(data.endDate),
    completionRate: data.completionRate ?? '0',
  };
  delete tempTimeTrace.timeTraceRecord;
  const [timeTrace, setTimeTrace] = useState(tempTimeTrace);
  let tempDayRecord;
  if (data.timeTraceRecord) {
    tempDayRecord = { ...data.timeTraceRecord };
  } else {
    tempDayRecord = {
      traceId: data.id,
      recordDate: currentDate.format(dateFormat),
      completionStatus: 'INITIAL', // 0-INITIAL-初始；2-DONE-完成；3-CLOSED-没做；
      score: 0,
      recordValue: '',
      summary: '',
    };
  }
  const [dayRecord, setDayRecord] = useState(tempDayRecord);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colSpan, setColSpan] = useState(12);

  useEffect(() => {
    if (timeTrace.themeId) {
      getSubTags(timeTrace.themeId).then((result) => setWorkOptions(result));
    }
    if (timeTrace.workId) {
      getSubTags(timeTrace.workId).then((result) => setTargetOptions(result));
    }
    // 设置对屏幕的监听，响应式布局
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      // 根据 div 容器宽度，调整主题、事项、目标宽度占比
      let newSize;
      if (width < 960) {
        newSize = 16;
      } else if (width < 1080) {
        newSize = 15;
      } else if (width < 1180) {
        newSize = 14;
      } else if (width < 1280) {
        newSize = 13;
      } else {
        newSize = 12;
      }
      setColSpan(newSize);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <Row>
        <Col span={colSpan}>
          <Row wrap={false}>
            <Col flex={'auto'}>
              {/* 主题 */}
              <Select
                value={timeTrace.themeId}
                className={styles.selectItem}
                style={{ width: 'calc(50% - 5px)' }}
                options={themeOptions}
                onSelect={(value) => {
                  let newVar = { ...timeTrace, themeId: value, workId: null, targetId: null };
                  setTimeTrace(newVar);
                  getSubTags(value).then((result) => setWorkOptions(result));
                  updateTrace(newVar).then();
                }}
              />
              {/* 事项 */}
              <Select
                value={timeTrace.workId}
                className={styles.selectItem}
                style={{ width: 'calc(50% - 5px)' }}
                options={workOptions}
                onSelect={(value) => {
                  let newVar = { ...timeTrace, workId: value, targetId: null };
                  setTimeTrace(newVar);
                  getSubTags(value).then((result) => setTargetOptions(result));
                  updateTrace(newVar).then();
                }}
              />
            </Col>
            <Col flex={'450px'}>
              <Input
                value="开始"
                className={`${styles.spanLabel} ${styles.blueSpanLabel}`}
                style={{ width: '40px' }}
              />
              <DatePicker
                className={styles.datePicker}
                style={{ width: '90px' }}
                value={timeTrace.startDate}
                format={dateFormat}
                onChange={(date) => {
                  setTimeTrace({ ...timeTrace, startDate: date });
                  updateTrace({
                    ...timeTrace,
                    startDate: date.format(dateFormat),
                    endDate: timeTrace.endDate.format(dateFormat),
                  }).then();
                }}
              />
              <Input
                className={styles.spanLabel}
                value="累积"
                style={{ width: '40px', borderColor: '#65be8a', backgroundColor: '#65be8a' }}
              />
              <Input
                className={styles.inputItem}
                value={timeTrace.accumulateCount}
                style={{ width: '40px', borderColor: '#65be8a', color: '#65be8a' }}
              />
              <Input
                className={styles.spanLabel}
                value="缺失"
                style={{ width: '40px', borderColor: '#f88a22', backgroundColor: '#f88a22' }}
              />
              <Input
                className={styles.inputItem}
                value={timeTrace.missCount}
                style={{ width: '40px', borderColor: '#f88a22', color: '#f88a22' }}
              />
              <Input
                className={styles.spanLabel}
                value="比率"
                style={{ width: '40px', borderColor: '#f7c115', backgroundColor: '#f7c115' }}
              />
              <Input
                className={styles.inputItem}
                value={`${timeTrace.completionRate}%`}
                style={{ width: '68px', borderColor: '#f7c115', color: '#f7c115' }}
              />
            </Col>
            <Col flex="25px">
              <DeleteIcon className={styles.deleteIcon} onClick={() => deleteOne(timeTrace.id)} />
            </Col>
          </Row>
        </Col>
        <Col span={24 - colSpan} style={{ paddingLeft: '8px' }}>
          <Input
            className={`${styles.spanLabel} ${styles.blueSpanLabel}`}
            value="今日数据"
            style={{ width: '86px' }}
          />
          <Input
            className={`${styles.spanLabel} ${styles.blueSpanLabel}`}
            value="设值"
            style={{ width: '40px' }}
          />
          <Input
            className={styles.inputItem}
            value={dayRecord.recordValue}
            style={{ width: 'calc(100% - 146px)' }}
            onChange={(e) => setDayRecord({ ...dayRecord, recordValue: e.target.value })}
            onBlur={() => {
              markDay(dayRecord).then();
            }}
          />
        </Col>
      </Row>
      {!foldFlag && (
        <Row>
          <Col span={colSpan}>
            <Row wrap={false}>
              <Col flex={'auto'}>
                {/* 目标 */}
                <Select
                  value={timeTrace.targetId}
                  className={styles.selectItem}
                  style={{ width: 'calc(100% - 5px)' }}
                  options={targetOptions}
                  onSelect={(value) => {
                    let newVar = { ...timeTrace, workId: value, targetId: null };
                    setTimeTrace(newVar);
                    updateTrace(newVar).then();
                  }}
                />
              </Col>
              <Col flex={'450px'}>
                <Input
                  className={`${styles.spanLabel} ${styles.blueSpanLabel}`}
                  value="结束"
                  style={{ width: '40px' }}
                />
                <DatePicker
                  value={timeTrace.endDate}
                  className={styles.datePicker}
                  style={{ width: '90px' }}
                  format={dateFormat}
                  onChange={(date) => {
                    setTimeTrace({ ...timeTrace, endDate: date });
                    updateTrace({
                      ...timeTrace,
                      startDate: timeTrace.startDate.format(dateFormat),
                      endDate: date.format(dateFormat),
                    }).then();
                  }}
                />
                <Input
                  className={styles.spanLabel}
                  value="消耗"
                  style={{ width: '40px', borderColor: '#5bb1c9', backgroundColor: '#5bb1c9' }}
                />
                <Input
                  className={styles.inputItem}
                  value={timeTrace.consumeCount}
                  style={{ width: '40px', borderColor: '#5bb1c9', color: '#5bb1c9' }}
                />
                <Input
                  className={styles.spanLabel}
                  value="连续"
                  style={{ width: '40px', borderColor: '#2585b7', backgroundColor: '#2585b7' }}
                />
                <Input
                  className={styles.inputItem}
                  value={timeTrace.continuousCount}
                  style={{ width: '40px', borderColor: '#2585b7', color: '#2585b7' }}
                />
                <Input
                  className={styles.spanLabel}
                  value="最大连续"
                  style={{ width: '68px', borderColor: '#7e3b82', backgroundColor: '#7e3b82' }}
                />
                <Input
                  className={styles.inputItem}
                  value={timeTrace.maxContinuous}
                  style={{ width: '40px', borderColor: '#7e3b82', color: '#7e3b82' }}
                />
              </Col>
              <Col flex="25px">
                <CalendarOutlined className={styles.refresh} />
              </Col>
            </Row>
          </Col>
          <Col span={24 - colSpan} style={{ paddingLeft: '8px' }}>
            <ThumbsUp
              isUp={true}
              width={22}
              height={22}
              margin={'2px 5px 0 2px'}
              color={thumbsColor(true, dayRecord.completionStatus)}
              onClick={() => {
                if (dayRecord.completionStatus !== 'DONE') {
                  markDay({ ...dayRecord, completionStatus: 'DONE' }).then((result) => {
                    setDayRecord(result);
                  });
                }
              }}
            />
            <ThumbsUp
              isUp={false}
              width={22}
              height={22}
              margin={'2px 5px 0 2px'}
              color={thumbsColor(false, dayRecord.completionStatus)}
              onClick={() => {
                if (dayRecord.completionStatus !== 'CLOSED') {
                  markDay({ ...dayRecord, completionStatus: 'CLOSED' }).then((result) => {
                    setDayRecord(result);
                  });
                }
              }}
            />
            <InputNumber
              style={{ width: '30px', top: '-5px' }}
              className={styles.inputNumberItem}
              step={1}
              min={0}
              max={10}
              changeOnWheel={true}
              value={dayRecord.score}
              onChange={(value) => setDayRecord({ ...dayRecord, score: value })}
              onBlur={() => markDay(dayRecord)}
            />
            <Input
              className={`${styles.spanLabel} ${styles.blueSpanLabel}`}
              value="总结"
              style={{ width: '40px', top: '-5px' }}
            />
            <Input
              value={dayRecord.summary}
              className={styles.inputItem}
              style={{ width: 'calc(100% - 146px)', top: '-5px' }}
              onChange={(e) => setDayRecord({ ...dayRecord, summary: e.target.value })}
              onBlur={() => markDay(dayRecord)}
            />
          </Col>
        </Row>
      )}
      <Row style={{ marginTop: foldFlag ? '1px' : '-2px' }}>
        <Progress
          percent={timeTrace.completionRate}
          showInfo={false}
          strokeColor="#81d3f8"
          trailColor="#c6c6c6"
          className={styles.progress}
        />
      </Row>
    </div>
  );
}
