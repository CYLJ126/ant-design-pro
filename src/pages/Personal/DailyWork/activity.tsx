import React from 'react';
import { Col, Input, Row, TimePicker } from 'antd';
import styles from './activity.less';

function Time({ placeholder }) {
  return (
    <Row>
      <Col span={8}>
        <hr className={styles.line} />
      </Col>
      <Col span={16}>
        <TimePicker format="HH:mm" className={styles.time} placeholder={placeholder} />
      </Col>
    </Row>
  );
}

export default function DailyWork() {
  return (
    <Row>
      <Col span={3}>
        <Row style={{ marginBottom: '20px' }}>
          <Time placeholder="开始时间" />
        </Row>
        <Row>
          <Time placeholder="结束时间" />
        </Row>
      </Col>
      <Col span={6}>
        <Row>
          <Col span={16}>
            <Row>
              <Input className={styles.tagInput} value="工作" />
              <Input className={styles.tagInput} value="60%" />
              <Input className={styles.tagInput} value="10" />
            </Row>
            <Input className={styles.work} value="工作" />
          </Col>
          <Col span={8}></Col>
        </Row>
        <Row>
          <Input className={styles.activityName} value="10" />
        </Row>
      </Col>
      <Col span={15}>
        <Input.TextArea />
      </Col>
    </Row>
  );
}
