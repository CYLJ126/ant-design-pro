import React, { useState } from 'react';
import { Col, Input, Row } from 'antd';
import styles from './head.less';

export interface HeadContent {
  id: number;
  themeShow: string;
  itemShow: string;
  target: string;
  scoreShow: string;
  proportion: number;
  startTime: string;
  endTime: string;
}

export default function Head({ headParam }) {
  const [head, setHead] = useState(headParam);

  return (
    <Row>
      <Col span={11}>
        <Row style={{ marginBottom: '5px' }}>
          <Col span={12}>
            <Input value={head.themeShow} className={styles.theme} />
          </Col>
          <Col span={12}>
            <Row>
              <Input value={head.scoreShow} className={styles.score} />
            </Row>
            <Row>
              <Input
                value={head.proportion + '%'}
                className={styles.proportion}
                onChange={(e) => setHead({ ...head, proportion: e.target.value })}
              />
            </Row>
          </Col>
        </Row>
        <Row>
          <Input value={head.itemShow} className={styles.item} />
        </Row>
      </Col>
      <Col span={13}>
        <Row>
          <span className={styles.progress}>01/24 - 02/23</span>
        </Row>
        <Row>
          <Input value={head.target} className={styles.target} />
        </Row>
      </Col>
    </Row>
  );
}
