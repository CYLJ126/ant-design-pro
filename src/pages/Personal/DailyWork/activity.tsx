import React from 'react';
import { Col, Input, Row, TimePicker } from 'antd';
import styles from './activity.less';
import { createStyles } from 'antd-style';

const useDailyStyle = (color) => {
  return createStyles(({ css }) => ({
    dailyStyle: css`
      .ant-input-group-addon {
        border-color: ${color};
        background-color: ${color};
      }

      .ant-input {
        color: ${color};
        border-color: ${color};
      }
    `,
  }))();
};

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

export default function DailyWork({ dailyWork }) {
  const { styles: dynamicStyle } = useDailyStyle(
    dailyWork.status === 'INITIAL' ? '#81d3f8' : '#c6c6c6',
  );
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
              <Input className={`${dynamicStyle.dailyStyle} ${styles.tagInput}`} value="工作" />
              <Input className={`${dynamicStyle.dailyStyle} ${styles.tagInput}`} value="60%" />
              <Input className={`${dynamicStyle.dailyStyle} ${styles.tagInput}`} value="10" />
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
