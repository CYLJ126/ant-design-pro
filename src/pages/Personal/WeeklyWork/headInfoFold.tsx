import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import styles from './headInfoFold.less';
import { getSubTags } from './headInfo';
import ProgressDateBar from './ProgressDateBar';

export default function HeadInfoFold({ headParam, saveHead, postUpdate }) {
  const [head, setHead] = useState(headParam);
  const [workOptions, setWorkOptions] = useState([]);

  useEffect(() => {
    setHead(headParam);
    if (headParam?.themeId) {
      getSubTags({ fatherId: headParam.themeId }).then((result) => {
        setWorkOptions(result);
      });
    }
  }, [headParam]);

  return (
    <Row>
      <Col span={11}>
        <Row style={{ marginBottom: '5px' }}>
          <Col span={12}>
            <Input value={'' + head.score + '分'} className={styles.score} />
          </Col>
          <Col span={12}>
            <InputNumber
              step={5}
              min={0}
              max={100}
              changeOnWheel={true}
              controls={false}
              addonAfter="%"
              value={head.proportion}
              className={styles.proportion}
              onChange={(value) => {
                const temp = { ...head, proportion: value };
                setHead(temp);
              }}
              onBlur={() => saveHead(head, postUpdate)}
            />
          </Col>
        </Row>
        <Row>
          <Select
            value={head.workId}
            className={styles.work}
            options={workOptions}
            onSelect={(value) => {
              const temp = { ...head, workId: value };
              setHead(temp);
              saveHead(temp, postUpdate);
            }}
          />
        </Row>
      </Col>
      <Col span={13}>
        <ProgressDateBar
          head={head}
          onChangeFunc={(tempHead) => {
            setHead(tempHead);
            saveHead(tempHead, postUpdate);
          }}
        />
        <Row>
          <Input
            value={head.target}
            className={styles.target}
            onChange={(e) => setHead({ ...head, target: e.target.value })}
            onBlur={() => saveHead(head, postUpdate)}
          />
        </Row>
      </Col>
    </Row>
  );
}
