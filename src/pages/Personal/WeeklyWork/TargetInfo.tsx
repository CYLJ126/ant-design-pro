import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select } from 'antd';
import styles from './targetInfo.less';
import ProgressDateBar from './ProgressDateBar';
import { getTags } from '@/services/ant-design-pro/base';
import { useModel } from 'umi';
import { getTarget, updateWeeklyWorkProportion } from '@/services/ant-design-pro/dailyWork';

export async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function TargetInfo({ targetId }) {
  const { themeOptions } = useModel('activitiesModel');
  const [workOptions, setWorkOptions] = useState([]);
  const { updateInfo, setUpdateInfo } = useModel('targetUpdateModel');
  const { targets, updateTarget } = useModel('targetsModel');
  const [current, setCurrent] = useState(targets[targetId]);
  const [fold, setFold] = useState(current.foldFlag === 'NO');

  const saveCurrent = (param) => {
    if (!param.workId || !param.target) {
      console.log('事项 ID 或目标描述为空');
      return;
    }
    updateTarget(param);
  };

  const updateProportion = (param) => {
    updateWeeklyWorkProportion(param).then(() => {
      setUpdateInfo({ targetId: targetId, time: new Date(), fold: fold });
    });
  };

  useEffect(() => {
    // 监听折叠按钮的触发，并进行折叠或展开
    const { targetId: currentTargetId, fold: currentFoldFlag } = updateInfo;
    if (currentTargetId === targetId) {
      setFold(currentFoldFlag);
    }
  }, [updateInfo]);

  useEffect(() => {
    // 当主题变化时，获取对应的事项下拉列表
    if (current?.themeId) {
      getSubTags({ fatherId: current.themeId }).then((result) => {
        setWorkOptions(result);
        setCurrent({ ...current, workId: result[0].value });
      });
    }
  }, [current.themeId]);

  useEffect(() => {
    if (updateInfo.targetId === targetId) {
      getTarget(targetId).then((result) => {
        setCurrent({ ...current, score: result.score, progress: result.progress });
      });
    }
  }, [updateInfo]);

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
                    options={themeOptions.current}
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
                      onBlur={() => updateProportion(current)}
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
                    onBlur={() => updateProportion(current)}
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
            saveCurrent({ ...param, refreshFlag: true });
            setUpdateInfo({
              targetId: targetId,
              fold: fold,
              startDate: param.startDate,
              endDate: param.endDate,
              time: new Date(),
            });
          }}
        />
        <Row>
          {/* 目标描述 */}
          <Input.TextArea
            value={current.target}
            className={
              fold
                ? `${styles.target} ${styles.targetFold}`
                : `${styles.target} ${styles.targetUnfold}`
            }
            onChange={(e) => setCurrent({ ...current, target: e.target.value })}
            onBlur={() => saveCurrent(current)}
          />
        </Row>
      </Col>
    </Row>
  );
}
