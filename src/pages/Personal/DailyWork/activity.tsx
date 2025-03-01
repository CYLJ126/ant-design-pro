import React, { useState } from 'react';
import { Col, Input, InputNumber, Row, TimePicker } from 'antd';
import activityStyle from './activityStyle';
import { insertDailyWork, updateDailyWork } from '@/services/ant-design-pro/dailyWork';

function save(param) {
  if (param.id) {
    updateDailyWork(param).then();
  } else {
    insertDailyWork(param).then();
  }
}

function Time({ placeholder, status }) {
  const { styles: dynamicStyle } = activityStyle(status);
  return (
    <Row>
      <Col span={8}>
        <hr className={dynamicStyle.line} />
      </Col>
      <Col span={16}>
        <TimePicker format="HH:mm" className={dynamicStyle.time} placeholder={placeholder} />
      </Col>
    </Row>
  );
}

export default function DailyWork({ dailyWorkParam }) {
  const [dailyWork, setDailyWork] = useState({ ...dailyWorkParam });
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);
  return (
    <Row>
      <Col span={3}>
        <Row style={{ marginBottom: '37.5px' }}>
          <Time status={dailyWork.status} placeholder="开始时间" />
        </Row>
        <Row>
          <Time status={dailyWork.status} placeholder="结束时间" />
        </Row>
      </Col>
      <Col span={6}>
        <Row>
          <Col span={14}>
            <Row>
              <Input className={dynamicStyle.theme} size={'small'} value={dailyWork.themeId} />
              <InputNumber
                className={`${dynamicStyle.number} ${dynamicStyle.proportion}`}
                step={5}
                min={0}
                max={100}
                size={'small'}
                changeOnWheel={true}
                addonAfter="%"
                value={dailyWork.proportion}
                onChange={(value) => setDailyWork({ ...dailyWork, proportion: value })}
                onBlur={() => save(dailyWork)}
              />
              <InputNumber
                className={`${dynamicStyle.number} ${dynamicStyle.score}`}
                step={1}
                min={0}
                max={10}
                size={'small'}
                changeOnWheel={true}
                value={dailyWork.score}
                handleVisible={true}
                onChange={(value) => setDailyWork({ ...dailyWork, score: value })}
                onBlur={() => save(dailyWork)}
              />
            </Row>
            <Input size={'small'} className={dynamicStyle.work} value={dailyWork.workId} />
          </Col>
          <Col span={10}></Col>
        </Row>
        <Row>
          <Input className={dynamicStyle.target} value={dailyWork.content} />
        </Row>
      </Col>
      <Col span={15}>
        <Input.TextArea
          className={dynamicStyle.content}
          onChange={(e) => setDailyWork({ ...dailyWork, target: e.target.value })}
          onBlur={() => save(dailyWork)}
        />
      </Col>
    </Row>
  );
}
