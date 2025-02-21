import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Input, Progress, Row, Select } from 'antd';
import styles from './headInfo.less';
import { getTags } from '@/services/ant-design-pro/base';
import locale from 'antd/locale/zh_CN';
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

function saveHead(param) {
  console.log('保存内容：' + JSON.stringify(param));
}

export default function HeadInfo({ headParam }) {
  const [head, setHead] = useState(headParam);
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  useEffect(() => {
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
                  setWorkOptions(result);
                });
                setHead({ ...head, themeId: value });
              }}
            />
          </Col>
          <Col span={12}>
            <Row style={{ marginBottom: '5px' }}>
              <Input value={'' + head.score + '分'} className={styles.score} />
            </Row>
            <Row>
              <Input value={head.proportion + '%'} className={styles.score} />
            </Row>
          </Col>
        </Row>
        <Row>
          <Select
            value={head.workId}
            className={styles.work}
            options={workOptions}
            onSelect={(value) => {
              setHead({ ...head, workId: value });
            }}
          />
        </Row>
      </Col>
      <Col span={13}>
        <Row>
          <div className={styles.dateAndProgress}>
            <Progress
              percent={30}
              showInfo={false}
              strokeColor="#81d3f8"
              trailColor="#c6c6c6"
              className={styles.progress}
            />
            <DatePicker.RangePicker
              className={styles.date}
              placeholder={['开始', '结束']}
              format="MM/DD"
              locale={locale}
              defaultValue={[
                dayjs(head.startTime, 'YYYY/MM/DD'),
                dayjs(head.endTime, 'YYYY/MM/DD'),
              ]}
              onChange={(date) => {
                dayjs.extend(utc);
                saveHead({
                  ...head,
                  startTime: dayjs(date[0]).utc().local().format('YYYY-MM-DD'),
                  endTime: dayjs(date[1]).utc().local().format('YYYY-MM-DD'),
                });
              }}
            />
          </div>
        </Row>
        <Row>
          <Input.TextArea value={head.target} className={styles.target} />
        </Row>
      </Col>
    </Row>
  );
}
