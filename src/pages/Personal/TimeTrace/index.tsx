import React, { useState } from 'react';
import { Col, Row } from 'antd';
import KeepAlive from 'react-activation';
import Header from './header';
import TimeTrace from './timeTrace';
import styles from './index.less';
import { listTraces } from '@/services/ant-design-pro/dailyWork';
import { DateProvider } from './TimeTraceContext';

function TimeTraces() {
  const [timeTraces, setTimeTraces] = useState([]);

  const fetch = (param) => {
    listTraces(param).then((result) => {
      setTimeTraces(result);
    });
  };

  const time = new Date().getTime();
  return (
    <DateProvider>
      <Header listFunc={fetch} />
      <hr className={styles.horizontal} />
      <Row>
        <Col span={16}>
          {timeTraces.map((trace) => {
            return <TimeTrace data={trace} key={trace.id + '-' + time} />;
          })}
        </Col>
        <Col span={8}></Col>
      </Row>
    </DateProvider>
  );
}

export default () => {
  return (
    <KeepAlive name="timeTraces">
      <TimeTraces />
    </KeepAlive>
  );
};
