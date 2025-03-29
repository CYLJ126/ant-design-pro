import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import styles from './targetInfo.less';
import ProgressDateBar from './ProgressDateBar';
import { getTags } from '@/services/ant-design-pro/base';
import { useModel } from 'umi';

export async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function TargetInfo({ targetId }) {
  const [workOptions, setWorkOptions] = useState([]);
  const { getTargetById, updateTarget } = useModel('targetsModel');
  const [current, setCurrent] = useState(getTargetById(targetId));

  const saveCurrent = (param) => {
    if (!param.workId || !param.target) {
      console.log('事项 ID 或目标描述为空');
      return;
    }
    updateTarget(param);
  };

  useEffect(() => {
    // 当主题变化时，获取对应的事项下拉列表
    if (current?.themeId) {
      getSubTags({ fatherId: current.themeId }).then((result) => {
        setWorkOptions(result);
      });
    }
  }, [current.themeId]);

  return (
    <Row>
      <Col span={11}>
        <Row style={{ marginBottom: '5px' }}>
          <Col span={12}>
            <Input value={'' + current.score + '分'} className={styles.score} />
          </Col>
          <Col span={12}>
            <InputNumber
              step={5}
              min={0}
              max={100}
              changeOnWheel={true}
              controls={false}
              addonAfter="%"
              value={current.proportion}
              className={styles.proportion}
              onChange={(value) => {
                const temp = { ...current, proportion: value };
                setCurrent(temp);
              }}
              onBlur={() => saveCurrent(current)}
            />
          </Col>
        </Row>
        <Row>
          <Select
            value={current.workId}
            className={styles.work}
            options={workOptions}
            onSelect={(value) => {
              const temp = { ...current, workId: value };
              setCurrent(temp);
              saveCurrent(temp);
            }}
          />
        </Row>
      </Col>
      <Col span={13}>
        <ProgressDateBar
          target={current}
          onChangeFunc={(param) => {
            setCurrent(param);
            saveCurrent(param);
          }}
        />
        <Row>
          <Input
            value={current.target}
            className={styles.target}
            onChange={(e) => setCurrent({ ...current, target: e.target.value })}
            onBlur={() => saveCurrent(current)}
          />
        </Row>
      </Col>
    </Row>
  );
}
