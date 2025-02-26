import React from 'react';
import Header from './header';
import { Col, Row } from 'antd';
import styles from './index.less';
import Activity from './activity';

export default function DailyWork() {
  return (
    <div>
      <hr className={styles.vertical} />
      <Row>
        <Col span={18}>
          <Header />
          <hr className={styles.horizontal} />
          <Activity />
        </Col>
        <Col span={3}></Col>
      </Row>
    </div>
  );
}
