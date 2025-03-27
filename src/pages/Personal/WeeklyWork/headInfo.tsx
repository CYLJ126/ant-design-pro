import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import styles from './headInfo.less';
import { getTags } from '@/services/ant-design-pro/base';
import ProgressDateBar from './ProgressDateBar';

export async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function HeadInfo({ headParam, postUpdate, saveHead }) {
  const [head, setHead] = useState(headParam);
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);

  useEffect(() => {
    setHead(headParam);
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
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
            <Select
              value={head.themeId}
              className={styles.theme}
              options={themeOptions}
              onSelect={(value) => {
                getSubTags({ fatherId: value }).then((result) => {
                  setWorkOptions(result);
                });
                const temp = { ...head, workId: '', themeId: value };
                setHead(temp);
                saveHead(temp, postUpdate);
              }}
            />
          </Col>
          <Col span={12}>
            <Row style={{ marginBottom: '5px' }}>
              <Input value={'' + head.score + '分'} className={styles.score} />
            </Row>
            <Row>
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
            </Row>
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
          <Input.TextArea
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
