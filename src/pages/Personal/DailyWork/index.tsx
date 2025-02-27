import React, { useEffect, useState } from 'react';
import Header from './header';
import { Col, Row } from 'antd';
import styles from './index.less';
import Activity from './activity';
import {
  listDailyWork,
  // updateDailyWork,
  // deleteDailyWork,
  // insertDailyWork,
} from '@/services/ant-design-pro/dailyWork';
import dailyWork from '../../../../mock/dailyWork';

export default function DailyWork() {
  // const [whichDay, setWhichDay] = useState(new Date());
  const [dailyWorks, setDailyWorks] = useState([]);

  // function updateDay(day) {
  //   setWhichDay(day);
  // }
  //
  // function addNewDailyWork(param) {
  //   insertDailyWork(param).then();
  // }
  //
  // function deleteOneDailyWork(id) {
  //   deleteDailyWork(id).then();
  // }
  //
  // function editDailyWork(param) {
  //   updateDailyWork(param).then();
  // }

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
          <Header />
          <hr className={styles.horizontal} />
          {dailyWorks.map((item) => {
            return <Activity key={dailyWork.id + time} dailyWork={item} />;
          })}
        </Col>
        <Col span={3}></Col>
      </Row>
    </div>
  );
}
