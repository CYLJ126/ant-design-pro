import React, { useState } from 'react';
import { Col, Row } from 'antd';
import KeepAlive from 'react-activation';
import Header from './header';
import TimeTrace from './timeTrace';
import styles from './index.less';
import { listTraces } from '@/services/ant-design-pro/dailyWork';
import { TimeTraceProvider } from './TimeTraceContext';

export function TimeTraces() {
  const [timeTraces, setTimeTraces] = useState([]);

  const fetch = (param) => {
    listTraces(param).then((result) => {
      setTimeTraces(result);
    });
  };

  const time = new Date().getTime();
  return (
    <TimeTraceProvider>
      <Header listFunc={fetch} />
      <hr className={styles.horizontal} />
      <Row>
        <Col span={18}>
          {timeTraces.map((trace) => {
            return <TimeTrace data={trace} key={trace.id + '-' + time} />;
          })}
        </Col>
        <Col span={6}></Col>
      </Row>
    </TimeTraceProvider>
  );
}

export default () => {
  return (
    <KeepAlive name="timeTraces">
      <TimeTraces />
    </KeepAlive>
  );
};
