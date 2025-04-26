import React, { useEffect, useState } from 'react';
import Header from './header';
import { Col, Row } from 'antd';
import styles from './index.less';
import Activity from './activity';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import TodoWorkWrap from '@/pages/Personal/DailyWork/todoWorkWrap';
import KeepAlive from 'react-activation';
import { useModel } from 'umi';

function DailyWork() {
  const [dailyWorks, setDailyWorks] = useState([]);
  const { activities } = useModel('activitiesModel');
  dayjs.extend(utc);

  useEffect(() => {
    const sortedList = Object.values(activities).sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime),
    );
    setDailyWorks(sortedList);
  }, [activities]);

  const time = new Date().getTime();
  return (
    <div>
      <hr className={styles.vertical} />
      <Row>
        <Col span={18}>
          <Header />
          <hr className={styles.horizontal} />
          {dailyWorks.map((item) => {
            return <Activity key={item.id + time} dailyWorkParam={item} />;
          })}
        </Col>
        <Col span={6}>
          <TodoWorkWrap />
        </Col>
      </Row>
    </div>
  );
}

export default () => {
  return (
    <KeepAlive name="dailyWork">
      <DailyWork />
    </KeepAlive>
  );
};
