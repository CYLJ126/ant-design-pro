import React, { useState } from 'react';
import Header from './header';
import TimeTrace from './timeTrace';
import styles from './index.less';
import { listTraces } from '@/services/ant-design-pro/dailyWork';
import { TimeTraceProvider } from './TimeTraceContext';

export default function TimeTraces() {
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
      {timeTraces.map((trace) => {
        return <TimeTrace data={trace} key={trace.id + '-' + time} />;
      })}
    </TimeTraceProvider>
  );
}
