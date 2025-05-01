import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import { markDay, updateTrace } from '@/services/ant-design-pro/dailyWork';
import { useTimeTraceData } from './TimeTraceContext';

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
    <Row>
      <Col span={4}>
        <Row>
          <Col span={12}>
            <Select
              value={timeTrace.themeId}
              options={themeOptions}
              onSelect={(value) => {
                let newVar = { ...timeTrace, themeId: value, workId: null, targetId: null };
                setTimeTrace(newVar);
                setWorkOptions(getSubTags(timeTrace.themeId));
                updateTrace(newVar).then();
              }}
            />
          </Col>
          <Col span={12}>
            <Select
              value={timeTrace.workId}
              options={workOptions}
              onSelect={(value) => {
                let newVar = { ...timeTrace, workId: value, targetId: null };
                setTimeTrace(newVar);
                setTargetOptions(getSubTags(value));
                updateTrace(newVar).then();
              }}
            />
          </Col>
        </Row>
        <Row>
          <Select
            value={timeTrace.targetId}
            options={targetOptions}
            onSelect={(value) => {
              let newVar = { ...timeTrace, workId: value, targetId: null };
              setTimeTrace(newVar);
              updateTrace(newVar).then();
            }}
          />
        </Row>
      </Col>
      <Col span={3}>
        <Row>
          <span>开始</span>
          <DatePicker
            value={timeTrace.startDate}
            format={dateFormat}
            onChange={(date) => {
              setTimeTrace({ ...timeTrace, startDate: date });
              updateTrace({ ...timeTrace, startDate: date.format(dateFormat) }).then();
            }}
          />
        </Row>
        <Row>
          <span>结束</span>
          <DatePicker
            value={timeTrace.endDate}
            format={dateFormat}
            onChange={(date) => {
              setTimeTrace({ ...timeTrace, endDate: date });
              updateTrace({ ...timeTrace, endDate: date.format(dateFormat) }).then();
            }}
          />
        </Row>
      </Col>
      <Col span={2}>
        <Row>
          <span>累积</span>
          <Input value={timeTrace.accumulateCount} />
        </Row>
        <Row>
          <span>消耗</span>
          <Input value={timeTrace.consumeCount} />
        </Row>
      </Col>
      <Col span={2}>
        <Row>
          <span>缺失</span>
          <Input value={timeTrace.missCount} />
        </Row>
        <Row>
          <span>连续</span>
          <Input value={timeTrace.continuousCount} />
        </Row>
      </Col>
      <Col span={3}>
        <Row>
          <span>比率</span>
          <Input value={timeTrace.completionRate} />
        </Row>
        <Row>
          <span>最大连续</span>
          <Input value={timeTrace.maxContinuous} />
        </Row>
      </Col>
      <Col span={1}>
        <Row>
          <span>值域</span>
          <Input value={timeTrace.maxContinuous} />
        </Row>
        <Row>
          <span>最大连续</span>
          <Input value={timeTrace.maxContinuous} />
        </Row>
      </Col>
      <Col span={2}>
        <Row>
          <span>今日数据</span>
        </Row>
        <Row>
          <InputNumber
            step={1}
            min={0}
            max={10}
            changeOnWheel={true}
            value={dayRecord.score}
            onChange={(value) => setDayRecord({ ...dayRecord, score: value })}
            onBlur={() => markDay(dayRecord)}
          />
        </Row>
      </Col>
      <Col span={6}>
        <Row>
          <span>设值</span>
          <Input value={dayRecord.recordValue} />
        </Row>
        <Row>
          <span>总结</span>
          <Input value={dayRecord.summary} />
        </Row>
      </Col>
    </Row>
  );
}
