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
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const { targets, getTargetById, updateTarget } = useModel('targetsModel');
  const [current, setCurrent] = useState(getTargetById(targetId));
  const [fold, setFold] = useState(current.foldFlag === 'NO');

  const saveCurrent = (param) => {
    if (!param.workId || !param.target) {
      console.log('事项 ID 或目标描述为空');
      return;
    }
    updateTarget(param);
  };

  useEffect(() => {
    // 监听折叠按钮的触发，并进行折叠或展开
    let tempFold;
    for (const item of targets) {
      if (item.id === targetId) {
        tempFold = item.foldFlag === 'NO';
        break;
      }
    }
    if (fold !== tempFold) {
      setFold(tempFold);
    }
  }, [targets]);

  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
  }, []);

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
          {!fold ? (
            // 展开样式
            <>
              <Row>
                <Col span={12}>
                  <Select
                    value={current.themeId}
                    className={styles.theme}
                    options={themeOptions}
                    onSelect={(value) => {
                      getSubTags({ fatherId: value }).then((result) => {
                        setWorkOptions(result);
                      });
                      const temp = { ...current, workId: '', themeId: value };
                      setCurrent(temp);
                      saveCurrent(temp);
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Row style={{ marginBottom: '5px' }}>
                    <Input
                      value={'' + current.score + '分'}
                      className={`${styles.score} ${styles.scoreUnfold}`}
                    />
                  </Row>
                  <Row>
                    <InputNumber
                      step={5}
                      min={0}
                      max={100}
                      changeOnWheel={true}
                      controls={false}
                      addonAfter="%"
                      value={current.proportion}
                      className={`${styles.proportion} ${styles.proportionUnfold}`}
                      onChange={(value) => {
                        const temp = { ...current, proportion: value };
                        setCurrent(temp);
                      }}
                      onBlur={() => saveCurrent(current)}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ width: '100%' }}>
                <Select
                  value={current.workId}
                  className={`${styles.work} ${styles.workUnfold}`}
                  options={workOptions}
                  onSelect={(value) => {
                    const temp = { ...current, workId: value };
                    setCurrent(temp);
                    saveCurrent(temp);
                  }}
                />
              </Row>
            </>
          ) : (
            // 折叠样式
            <>
              <Row>
                <Col span={12}>
                  <Input
                    value={'' + current.score + '分'}
                    className={`${styles.score} ${styles.scoreFold}`}
                  />
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
                    className={`${styles.proportion} ${styles.proportionFold}`}
                    onChange={(value) => {
                      const temp = { ...current, proportion: value };
                      setCurrent(temp);
                    }}
                    onBlur={() => saveCurrent(current)}
                  />
                </Col>
              </Row>
              <Row style={{ width: '100%' }}>
                <Select
                  value={current.workId}
                  className={`${styles.work} ${styles.workFold}`}
                  options={workOptions}
                  onSelect={(value) => {
                    const temp = { ...current, workId: value };
                    setCurrent(temp);
                    saveCurrent(temp);
                  }}
                />
              </Row>
            </>
          )}
        </Row>
      </Col>
      <Col span={13}>
        {/* 进度和起止日期 */}
        <ProgressDateBar
          target={current}
          onChangeFunc={(param) => {
            setCurrent(param);
            saveCurrent(param);
          }}
        />
        <Row>
          {/* 目标描述 */}
          <Input
            value={current.target}
            className={
              current.foldFlag === 'YES'
                ? `${styles.target} ${styles.targetUnfold}`
                : `${styles.target} ${styles.targetFold}`
            }
            onChange={(e) => setCurrent({ ...current, target: e.target.value })}
            onBlur={() => saveCurrent(current)}
          />
        </Row>
      </Col>
    </Row>
  );
}
