import React, { useEffect, useState } from 'react';
import Header from './header';
import { Col, Row } from 'antd';
import styles from './index.less';
import Activity from './activity';
import { listDailyWork } from '@/services/ant-design-pro/dailyWork';

export default function DailyWork() {
  const [whichDay, setWhichDay] = useState(new Date());
  const [dailyWorks, setDailyWorks] = useState([]);

  function toggleDay(type) {
    let temp = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate());
    temp.setDate(whichDay.getDate() + (type === 'former' ? -1 : 1));
    setWhichDay(temp);
  }

  function addBlankDailyWork() {
    const blankOne = {
      // status: 'INITIAL',
      status: 'DONE',
      themeId: '工作',
      workId: 'E户通技术负责人',
      proportion: 0,
      startTime: new Date(),
      endTime: new Date(),
      score: 0,
      content: '整理PPT方案',
    };
    const list = [];
    list.push(blankOne);
    list.push(...dailyWorks);
    setDailyWorks(list);
  }

  useEffect(() => {
    listDailyWork(new Date()).then((result) => {
      setDailyWorks(result);
    });
  }, [whichDay]);

  const time = new Date().getTime();
  return (
    <div>
      <hr className={styles.vertical} />
      <Row>
        <Col span={18}>
          <Header add={addBlankDailyWork} toggleDay={toggleDay} />
          <hr className={styles.horizontal} />
          {dailyWorks.map((item) => {
            return <Activity key={item.id + time} dailyWorkParam={item} />;
          })}
        </Col>
        <Col span={3}></Col>
      </Row>
    </div>
  );
}
