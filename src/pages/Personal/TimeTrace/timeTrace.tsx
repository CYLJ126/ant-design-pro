import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import { markDay, updateTrace } from '@/services/ant-design-pro/dailyWork';
import { useTimeTraceData } from './TimeTraceContext';
import styles from './timeTrace.less';
import ThumbsUp from '@/icons/ThumbsUp';

const dateFormat = 'YYYY-MM-DD';

export default function TimeTrace({ data }) {
  const { getSubTags, themeOptions, currentDate } = useTimeTraceData();
  let tempTimeTrace = { ...data, startDate: dayjs(data.startDate), endDate: dayjs(data.endDate) };
  delete tempTimeTrace.timeTraceRecord;
  const [timeTrace, setTimeTrace] = useState(tempTimeTrace);
  let tempDayRecord;
  if (data.timeTraceRecord) {
    tempDayRecord = { ...data.timeTraceRecord };
  } else {
    tempDayRecord = {
      traceId: data.id,
      recordDate: currentDate.format(dateFormat),
      completionStatus: 'INITIAL', // 0-INITIAL-初始；2-DONE-完成；
      score: 0,
      recordValue: '',
      summary: '',
    };
  }
  const [dayRecord, setDayRecord] = useState(tempDayRecord);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);

  useEffect(() => {
    if (timeTrace.themeId) {
      getSubTags(timeTrace.themeId).then((result) => setWorkOptions(result));
    }
    if (timeTrace.workId) {
      getSubTags(timeTrace.workId).then((result) => setTargetOptions(result));
    }
  }, []);

  return (
    <div>
      <Row>
        <Col span={16}>
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
                  setWorkOptions(getSubTags(timeTrace.themeId));
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
                  setTargetOptions(getSubTags(value));
                  updateTrace(newVar).then();
                }}
              />
            </Col>
            <Col flex={'450px'}>
              <Input className={styles.spanLabel} value="开始" style={{ width: '40px' }} />
              <DatePicker
                className={styles.datePicker}
                style={{ width: '90px' }}
                value={timeTrace.startDate}
                format={dateFormat}
                onChange={(date) => {
                  setTimeTrace({ ...timeTrace, startDate: date });
                  updateTrace({ ...timeTrace, startDate: date.format(dateFormat) }).then();
                }}
              />
              <Input className={styles.spanLabel} value="累积" style={{ width: '40px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.accumulateCount}
                style={{ width: '40px' }}
              />
              <Input className={styles.spanLabel} value="缺失" style={{ width: '40px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.missCount}
                style={{ width: '40px' }}
              />
              <Input className={styles.spanLabel} value="比率" style={{ width: '40px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.completionRate}
                style={{ width: '68px' }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Input className={styles.spanLabel} value="今日数据" style={{ width: '82px' }} />
          <Input className={styles.spanLabel} value="设值" style={{ width: '40px' }} />
          <Input
            className={styles.inputItem}
            value={dayRecord.recordValue}
            style={{ width: 'calc(100% - 142px)' }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
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
              <Input className={styles.spanLabel} value="结束" style={{ width: '40px' }} />
              <DatePicker
                value={timeTrace.endDate}
                className={styles.datePicker}
                style={{ width: '90px' }}
                format={dateFormat}
                onChange={(date) => {
                  setTimeTrace({ ...timeTrace, endDate: date });
                  updateTrace({ ...timeTrace, endDate: date.format(dateFormat) }).then();
                }}
              />
              <Input className={styles.spanLabel} value="消耗" style={{ width: '40px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.consumeCount}
                style={{ width: '40px' }}
              />
              <Input className={styles.spanLabel} value="连续" style={{ width: '40px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.continuousCount}
                style={{ width: '40px' }}
              />
              <Input className={styles.spanLabel} value="最大连续" style={{ width: '68px' }} />
              <Input
                className={styles.inputItem}
                value={timeTrace.maxContinuous}
                style={{ width: '40px' }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <ThumbsUp isUp={true} width={22} height={22} margin={'2px 5px 0 0'} color={'#81d3f8'} />
          <ThumbsUp isUp={false} width={22} height={22} margin={'2px 5px 0 0'} color={'#81d3f8'} />
          <InputNumber
            style={{ width: '30px', top: '-5px' }}
            className={styles.inputNumberItem}
            step={1}
            min={0}
            max={10}
            changeOnWheel={true}
            value={'10'}
            onChange={(value) => setDayRecord({ ...dayRecord, score: value })}
            onBlur={() => markDay(dayRecord)}
          />
          <Input className={styles.spanLabel} value="总结" style={{ width: '40px', top: '-5px' }} />
          <Input
            value={dayRecord.summary}
            className={styles.inputItem}
            style={{ width: 'calc(100% - 142px)', top: '-5px' }}
          />
        </Col>
      </Row>
    </div>
  );
}
