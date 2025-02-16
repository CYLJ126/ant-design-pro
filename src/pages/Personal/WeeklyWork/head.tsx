import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import styles from './head.less';
import { getTags } from '@/services/ant-design-pro/base';

export interface HeadContent {
  id: number;
  themeId: number;
  itemId: number;
  target: string;
  scoreShow: string;
  proportion: number;
  startTime: string;
  endTime: string;
}

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'on' });
  return (
    result?.data?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function Head({ headParam }) {
  const [head, setHead] = useState(headParam);
  const [themeOptions, setThemeOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
    if (headParam?.themeId) {
      getSubTags({ fatherId: headParam.themeId }).then((result) => {
        setItemOptions(result);
      });
    }
  }, []);

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
                  setItemOptions(result);
                });
                setHead({ ...head, themeId: value });
              }}
            />
          </Col>
          <Col span={12}>
            <Row>
              <Input value={head.scoreShow} className={styles.score} />
            </Row>
            <Row>
              <InputNumber
                value={head.proportion}
                step={5}
                min={0}
                max={100}
                addonAfter="%"
                className={styles.proportion}
                onChange={(value) => setHead({ ...head, proportion: value })}
              />
            </Row>
          </Col>
        </Row>
        <Row>
          <Select
            value={head.itemId}
            className={styles.item}
            options={itemOptions}
            onSelect={(value) => {
              setHead({ ...head, itemId: value });
            }}
          />
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
