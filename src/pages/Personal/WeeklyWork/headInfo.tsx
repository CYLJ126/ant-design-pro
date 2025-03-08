import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Input, InputNumber, Progress, Row, Select } from 'antd';
import styles from './headInfo.less';
import { getTags } from '@/services/ant-design-pro/base';
import { updateWeeklyWork } from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';

export interface HeadContent {
  id: number;
  themeId: number;
  workId: number;
  target: string;
  score: number;
  proportion: number;
  startDate: string;
  endDate: string;
}

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function HeadInfo({ headParam, postUpdate }) {
  const [head, setHead] = useState(headParam);
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);

  function saveHead(param) {
    console.log('保存内容：' + JSON.stringify(param));
    if (!param.workId || !param.target) {
      console.log('事项 ID 或目标描述为空');
      return;
    }
    const headInfo = {
      id: param.id,
      themeId: param.themeId,
      workId: param.workId,
      orderId: param.orderId,
      target: param.target,
      proportion: param.proportion,
      startDate: param.startDate,
      endDate: param.endDate,
    };
    updateWeeklyWork(headInfo).then(() => postUpdate());
  }

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
                saveHead(temp);
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
                addonAfter="%"
                value={head.proportion}
                className={styles.proportion}
                onChange={(value) => {
                  const temp = { ...head, proportion: value };
                  setHead(temp);
                }}
                onBlur={() => saveHead(head)}
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
              saveHead(temp);
            }}
          />
        </Row>
      </Col>
      <Col span={13}>
        <Row>
          <div className={styles.dateAndProgress}>
            <Progress
              percent={head.progress}
              showInfo={false}
              strokeColor="#81d3f8"
              trailColor="#c6c6c6"
              className={styles.progress}
            />
            <DatePicker.RangePicker
              className={styles.date}
              placeholder={['开始', '结束']}
              format="MM/DD"
              defaultValue={[
                dayjs(head.startDate, 'YYYY/MM/DD'),
                dayjs(head.endDate, 'YYYY/MM/DD'),
              ]}
              onChange={(date) => {
                dayjs.extend(utc);
                const temp = {
                  ...head,
                  startDate: dayjs(date[0]).utc().local().format('YYYY-MM-DD'),
                  endDate: dayjs(date[1]).utc().local().format('YYYY-MM-DD'),
                };
                setHead(temp);
                saveHead(temp);
              }}
            />
          </div>
        </Row>
        <Row>
          <Input.TextArea
            value={head.target}
            className={styles.target}
            onChange={(e) => setHead({ ...head, target: e.target.value })}
            onBlur={() => saveHead(head)}
          />
        </Row>
      </Col>
    </Row>
  );
}
