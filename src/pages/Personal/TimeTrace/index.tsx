import React from 'react';
import Header from './header';
import TimeTrace from './timeTrace';
import styles from './index.less';
import { TimeTraceProvider, useTimeTraceData } from './TimeTraceContext';

function TraceWrap() {
  const { timeTraces } = useTimeTraceData();
  const time = new Date().getTime();
  return (
    <>
      <Header />
      <hr className={styles.horizontal} />
      {timeTraces?.map((trace) => {
        return <TimeTrace data={trace} key={trace.id + '-' + time} />;
      })}
    </>
  );
}

export default function TimeTraces() {
  return (
    <TimeTraceProvider>
      <TraceWrap />
    </TimeTraceProvider>
  );
}
