import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select, TimePicker } from 'antd';
import activityStyle from './activityStyle';
import styles from './activity.less';
import { insertDailyWork, updateDailyWork } from '@/services/ant-design-pro/dailyWork';
import { getTags } from '@/services/ant-design-pro/base';

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'on' });
  return (
    result?.data?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

function save(param) {
  if (param.id) {
    updateDailyWork(param).then();
  } else {
    insertDailyWork(param).then();
  }
}

function Time({ placeholder, status }) {
  const { styles: dynamicStyle } = activityStyle(status);
  return (
    <Row>
      <Col span={8}>
        <hr className={dynamicStyle.line} />
      </Col>
      <Col span={16}>
        <TimePicker format="HH:mm" className={dynamicStyle.time} placeholder={placeholder} />
      </Col>
    </Row>
  );
}

export default function DailyWork({ dailyWorkParam }) {
  const [dailyWork, setDailyWork] = useState({ ...dailyWorkParam });
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);

  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
    if (dailyWork?.themeId) {
      getSubTags({ fatherId: dailyWork.themeId }).then((result) => {
        setWorkOptions(result);
      });
    }
  }, [dailyWork]);

  return (
    <div className={styles.activity}>
      <Row>
        <Col span={3}>
          <Row style={{ marginBottom: '64px' }}>
            <Time status={dailyWork.status} placeholder="开始时间" />
          </Row>
          <Row>
            <Time status={dailyWork.status} placeholder="结束时间" />
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={12}>
              <Row>
                <Col span={14}>
                  <Select
                    value={dailyWork.themeId}
                    className={dynamicStyle.theme}
                    options={themeOptions}
                    onSelect={(value) => {
                      getSubTags({ fatherId: value }).then((result) => {
                        setWorkOptions(result);
                      });
                      const temp = { ...dailyWork, workId: '', themeId: value };
                      setDailyWork(temp);
                      save(temp);
                    }}
                  />
                </Col>
                <Col span={10}>
                  <Row>
                    <InputNumber
                      className={`${dynamicStyle.number} ${dynamicStyle.proportion}`}
                      step={5}
                      min={0}
                      max={100}
                      size={'small'}
                      changeOnWheel={true}
                      addonAfter="%"
                      value={dailyWork.proportion}
                      onChange={(value) => setDailyWork({ ...dailyWork, proportion: value })}
                      onBlur={() => save(dailyWork)}
                    />
                  </Row>
                  <Row>
                    <InputNumber
                      className={`${dynamicStyle.number} ${dynamicStyle.score}`}
                      step={1}
                      min={0}
                      max={10}
                      size={'small'}
                      changeOnWheel={true}
                      value={dailyWork.score}
                      handleVisible={true}
                      onChange={(value) => setDailyWork({ ...dailyWork, score: value })}
                      onBlur={() => save(dailyWork)}
                    />
                  </Row>
                </Col>
              </Row>
              <Select
                value={dailyWork.workId}
                size={'small'}
                className={dynamicStyle.work}
                options={workOptions}
                onSelect={(value) => {
                  const temp = { ...dailyWork, workId: value };
                  setDailyWork(temp);
                  save(temp);
                }}
              />
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row>
            <Input className={dynamicStyle.target} value={dailyWork.content} />
          </Row>
        </Col>
        <Col span={15}>
          <Input.TextArea
            className={dynamicStyle.content}
            onChange={(e) => setDailyWork({ ...dailyWork, target: e.target.value })}
            onBlur={() => save(dailyWork)}
          />
        </Col>
      </Row>
      <Row>
        <hr className={dynamicStyle.separator} />
      </Row>
    </div>
  );
}
