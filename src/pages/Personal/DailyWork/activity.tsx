import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, message, Row, Select, TimePicker } from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  RiseOutlined,
  SolutionOutlined,
  UndoOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import activityStyle from './activityStyle';
import styles from './activity.less';
import {
  deleteDailyWork,
  getTargets,
  insertDailyWork,
  markDone,
  updateDailyWork,
} from '@/services/ant-design-pro/dailyWork';
import { getTags } from '@/services/ant-design-pro/base';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'on' });
  return (
    result?.data?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

function Time({ dailyWork, save }) {
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);
  dayjs.extend(utc);
  return (
    <Row>
      <Col span={8}>
        <hr className={dynamicStyle.line} />
      </Col>
      <Col span={16}>
        <TimePicker
          defaultValue={dayjs(dailyWork[dailyWork.mark]).utc().local()}
          format="HH:mm"
          className={dynamicStyle.time}
          placeholder={dailyWork.placeholder}
          onChange={(time, timeString) => {
            let temp = { ...dailyWork };
            const dateStr = dayjs(dailyWork.startTime).utc().local().format('YYYY-MM-DD');
            if (dailyWork.mark === 'startTime') {
              temp.startTimeStr = dateStr + ' ' + timeString + ':00';
              temp.endTimeStr =
                dateStr + ' ' + dayjs(dailyWork.endTime).utc().local().format('HH:mm:ss');
            } else {
              temp.endTimeStr = dateStr + ' ' + timeString + ':59';
              temp.startTimeStr =
                dateStr + ' ' + dayjs(dailyWork.startTime).utc().local().format('HH:mm:ss');
            }
            save(temp);
          }}
        />
      </Col>
    </Row>
  );
}

export default function DailyWork({ dailyWorkParam, postUpdate }) {
  const [dailyWork, setDailyWork] = useState({ ...dailyWorkParam });
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);

  function save(param) {
    if (!param.targetId) {
      message.error('请完善目标信息');
    }
    let data = {
      id: param.id,
      startTime: param.startTimeStr,
      endTime: param.endTimeStr,
      targetId: param.targetId,
      score: param.score,
      proportion: param.proportion,
      content: param.content,
    };
    if (data.id) {
      updateDailyWork(data).then((result) => {
        if (result) {
          message.success('更新成功！');
        } else {
          message.error('更新失败！');
        }
      });
    } else {
      insertDailyWork(data).then((result) => {
        if (result) {
          message.success('新增成功！');
        } else {
          message.error('新增失败！');
        }
      });
    }
    postUpdate();
  }

  function handleDoneOrDelete(id, type) {
    if (type === 'delete') {
      // 删除
      deleteDailyWork(id).then(() => {
        postUpdate();
      });
    } else if (type === 'push') {
      let start = dayjs(dailyWork.startTime).add(1, 'day');
      let end = dayjs(dailyWork.endTime).add(1, 'day');
      let startTimeStr = dayjs(start).utc().local().format('YYYY-MM-DD HH:mm') + ':00';
      let endTimeStr = dayjs(end).utc().local().format('YYYY-MM-DD HH:mm') + ':59';
      let newOne = {
        targetId: dailyWork.targetId,
        score: 0,
        proportion: dailyWork.proportion,
        content: dailyWork.content,
        startTimeStr: startTimeStr,
        endTimeStr: endTimeStr,
      };
      save(newOne);
    } else {
      markDone(id, type).then(() => {
        postUpdate();
      });
    }
  }

  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
  }, [dailyWork]);

  useEffect(() => {
    if (dailyWork?.themeId) {
      getSubTags({ fatherId: dailyWork.themeId }).then((result) => {
        setWorkOptions(result);
      });
    }
  }, [dailyWork.themeId]);

  useEffect(() => {
    if (dailyWork?.workId) {
      getTargets({ workId: dailyWork.workId }).then((result) => {
        setTargetOptions(
          result.map((item) => {
            return { value: item.id, label: item.target };
          }),
        );
      });
    }
  }, [dailyWork.workId]);

  return (
    <div className={styles.activity}>
      <Row>
        <Col span={3}>
          <Row style={{ marginBottom: '64px' }}>
            <Time
              dailyWork={{ ...dailyWork, mark: 'startTime', placeholder: '开始时间' }}
              save={save}
            />
          </Row>
          <Row>
            <Time
              dailyWork={{ ...dailyWork, mark: 'endTime', placeholder: '结束时间' }}
              save={save}
            />
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
                      const temp = { ...dailyWork, themeId: value, workId: '', targetId: '' };
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
                  const temp = { ...dailyWork, workId: value, targetId: '' };
                  setDailyWork(temp);
                  save(temp);
                }}
              />
            </Col>
            <Col span={12} style={{ paddingLeft: '10px' }}>
              <Row>
                <DeleteOutlined
                  className={dynamicStyle.icons}
                  onClick={() => {
                    handleDoneOrDelete(dailyWork.id, 'delete');
                  }}
                />
                {dailyWork.status === 'INITIAL' ? (
                  <CheckOutlined
                    className={dynamicStyle.icons}
                    onClick={() => {
                      handleDoneOrDelete(dailyWork.id, 'DONE');
                    }}
                  />
                ) : (
                  <UndoOutlined
                    className={dynamicStyle.icons}
                    onClick={() => {
                      handleDoneOrDelete(dailyWork.id, 'INITIAL');
                    }}
                  />
                )}
                <VerticalAlignMiddleOutlined className={dynamicStyle.icons} />
              </Row>
              <Row>
                <RiseOutlined
                  className={dynamicStyle.icons}
                  onClick={() => {
                    handleDoneOrDelete(dailyWork.id, 'push');
                  }}
                />
              </Row>
              <Row>
                <SolutionOutlined className={dynamicStyle.icons} />
              </Row>
            </Col>
          </Row>
          <Row>
            <Select
              value={dailyWork.targetId}
              className={dynamicStyle.target}
              options={targetOptions}
              onSelect={(value) => {
                const temp = { ...dailyWork, targetId: value };
                setDailyWork(temp);
                save(temp);
              }}
            />
          </Row>
        </Col>
        <Col span={15}>
          <Input.TextArea
            value={dailyWork.content}
            className={dynamicStyle.content}
            onChange={(e) => setDailyWork({ ...dailyWork, content: e.target.value })}
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
