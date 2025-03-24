import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, message, Row, Select } from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SolutionOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import activityStyle from './activityStyle';
import styles from './activity.less';
import {
  deleteDailyWork,
  foldActivity,
  getTargets,
  insertDailyWork,
  markDone,
  updateDailyWork,
} from '@/services/ant-design-pro/dailyWork';
import { getTags } from '@/services/ant-design-pro/base';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';
import DeleteIcon from '@/icons/DeleteIcon';
import ArrowRightIcon from '@/icons/ArrowRightIcon';
import SuccessIcon from '@/icons/SuccessIcon';
import Time from './time';

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function Activity({ dailyWorkParam, postUpdate }) {
  const [dailyWork, setDailyWork] = useState({ ...dailyWorkParam });
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);
  const color = dailyWork.status === 'DONE' ? '#6294a5' : '#81d3f8';

  function save(param) {
    if (!param.targetId) {
      return;
    }
    let data = {
      id: param.id,
      startTime:
        param.startTimeStr || dayjs(param.startTime).utc().local().format('YYYY-MM-DD HH:mm:ss'),
      endTime: param.endTimeStr || dayjs(param.endTime).utc().local().format('YYYY-MM-DD HH:mm:ss'),
      targetId: param.targetId,
      score: param.score,
      cost: param.cost,
      foldFlag: param.foldFlag,
      proportion: param.proportion,
      content: param.content,
    };
    if (data.id) {
      updateDailyWork(data).then((result) => {
        if (!result) {
          message.error('更新失败！');
        }
        postUpdate();
      });
    } else {
      insertDailyWork(data).then((result) => {
        if (!result) {
          message.error('新增失败！');
        }
        postUpdate();
      });
    }
  }

  function handleDoneOrDelete(type, data) {
    const { id, state } = data;
    if (!id && type !== 'push') {
      // 如果操作时，没有 id，且不是推入后一天，则不做操作
      return;
    }
    if (type === 'delete') {
      // 删除
      if (id) {
        deleteDailyWork(id).then(() => {
          postUpdate();
        });
      }
    } else if (type === 'push') {
      let start = dayjs(dailyWork.startTime).add(1, 'day');
      let end = dayjs(dailyWork.endTime).add(1, 'day');
      let startTimeStr = dayjs(start).utc().local().format('YYYY-MM-DD HH:mm:ss');
      let endTimeStr = dayjs(end).utc().local().format('YYYY-MM-DD HH:mm:ss');
      let newOne = {
        targetId: dailyWork.targetId,
        score: 0,
        foldFlag: 'YES',
        proportion: dailyWork.proportion,
        content: dailyWork.content,
        startTimeStr: startTimeStr,
        endTimeStr: endTimeStr,
      };
      save(newOne);
    } else if (type === 'mark') {
      markDone(id, state).then(() => postUpdate());
    } else if (type === 'fold') {
      // NO-fold-折叠；YES-unfold-展开；
      foldActivity(id, state === 'fold' ? 'NO' : 'YES').then(() => postUpdate());
    }
  }

  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
  }, []);

  useEffect(() => {
    if (dailyWork?.themeId) {
      getSubTags({ fatherId: dailyWork.themeId }).then((result) => {
        setWorkOptions(result);
      });
    }
  }, [dailyWork.themeId]);

  useEffect(() => {
    if (dailyWork?.workId) {
      getTargets({
        workId: dailyWork.workId,
        whichDay: dayjs(dailyWork.startTime).utc().local().format('YYYY-MM-DD'),
      }).then((result) => {
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
        <Col span={2}>
          <Row style={{ marginBottom: dailyWork.foldFlag === 'YES' ? '64px' : '5px' }}>
            <Time
              showLine={true}
              dailyWork={{ ...dailyWork, mark: 'startTime', placeholder: '开始时间' }}
              save={save}
            />
          </Row>
          <Row>
            <Time
              showLine={true}
              dailyWork={{ ...dailyWork, mark: 'endTime', placeholder: '结束时间' }}
              save={save}
            />
          </Row>
        </Col>
        <Col span={7} style={{ paddingLeft: '14px' }}>
          {dailyWork.foldFlag === 'YES' ? (
            <Row>
              <Col span={12}>
                <Row>
                  <Row>
                    <Col span={12}>
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
                    <Col span={12}>
                      <InputNumber
                        className={dynamicStyle.number}
                        step={1}
                        min={0}
                        max={10}
                        size={'small'}
                        changeOnWheel={true}
                        controls={false}
                        addonAfter="分"
                        value={dailyWork.score}
                        onChange={(value) => setDailyWork({ ...dailyWork, score: value })}
                        onBlur={() => save(dailyWork)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <InputNumber
                        className={dynamicStyle.number}
                        step={5}
                        min={0}
                        max={100}
                        size={'small'}
                        changeOnWheel={true}
                        controls={false}
                        addonAfter="%"
                        value={dailyWork.proportion}
                        onChange={(value) => setDailyWork({ ...dailyWork, proportion: value })}
                        onBlur={() => save(dailyWork)}
                      />
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        className={dynamicStyle.number}
                        step={0.5}
                        min={0}
                        max={10}
                        size={'small'}
                        changeOnWheel={true}
                        controls={false}
                        addonAfter="h"
                        value={dailyWork.cost}
                        onChange={(value) => setDailyWork({ ...dailyWork, cost: value })}
                        onBlur={() => save(dailyWork)}
                      />
                    </Col>
                  </Row>
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
                  {/* 删除 */}
                  <DeleteIcon
                    width={25}
                    height={25}
                    color={color}
                    onClick={() => {
                      handleDoneOrDelete('delete', { id: dailyWork.id });
                    }}
                  />
                  {dailyWork.status === 'INITIAL' ? (
                    // 完成
                    <SuccessIcon
                      width={20}
                      height={20}
                      color={color}
                      margin="3px 0 0 4px"
                      onClick={() => {
                        handleDoneOrDelete('mark', { id: dailyWork.id, state: 'DONE' });
                      }}
                    />
                  ) : (
                    // 待办
                    <UndoOutlined
                      className={dynamicStyle.todoIcon}
                      onClick={() => {
                        handleDoneOrDelete('mark', { id: dailyWork.id, state: 'INITIAL' });
                      }}
                    />
                  )}
                  {/* 折叠 */}
                  <FullscreenExitOutlined
                    className={dynamicStyle.foldIcon}
                    onClick={() => {
                      setDailyWork({ ...dailyWork, foldFlag: 'NO' });
                      handleDoneOrDelete('fold', { id: dailyWork.id, state: 'fold' });
                    }}
                  />
                </Row>
                <Row>
                  {/* 推到下一天 */}
                  <ArrowRightIcon
                    width={23}
                    height={24}
                    color={color}
                    margin="2px 0 0 2px"
                    onClick={() => {
                      handleDoneOrDelete('push', { id: dailyWork.id });
                    }}
                  />
                </Row>
                <Row>
                  {/* 总结 */}
                  <SolutionOutlined className={dynamicStyle.summaryIcon} />
                </Row>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={4}>
                <InputNumber
                  className={dynamicStyle.number}
                  step={5}
                  min={0}
                  max={100}
                  size={'small'}
                  changeOnWheel={true}
                  controls={false}
                  addonAfter="%"
                  value={dailyWork.proportion}
                  onChange={(value) => setDailyWork({ ...dailyWork, proportion: value })}
                  onBlur={() => save(dailyWork)}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  className={dynamicStyle.number}
                  step={1}
                  min={0}
                  max={10}
                  size={'small'}
                  changeOnWheel={true}
                  controls={false}
                  addonAfter="分"
                  value={dailyWork.score}
                  onChange={(value) => setDailyWork({ ...dailyWork, score: value })}
                  onBlur={() => save(dailyWork)}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  className={dynamicStyle.number}
                  step={0.5}
                  min={0}
                  max={10}
                  size={'small'}
                  changeOnWheel={true}
                  controls={false}
                  addonAfter="h"
                  value={dailyWork.cost}
                  onChange={(value) => setDailyWork({ ...dailyWork, cost: value })}
                  onBlur={() => save(dailyWork)}
                />
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={4}>
                    {/* 删除 */}
                    <DeleteIcon
                      margin="0 0 0 10px"
                      width={25}
                      height={25}
                      color={color}
                      onClick={() => {
                        handleDoneOrDelete('delete', { id: dailyWork.id });
                      }}
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '10px', paddingTop: '3px' }}>
                    {dailyWork.status === 'INITIAL' ? (
                      // 完成
                      <SuccessIcon
                        width={20}
                        height={20}
                        color={color}
                        margin="0 0 0 4px"
                        onClick={() => {
                          handleDoneOrDelete('mark', { id: dailyWork.id, state: 'DONE' });
                        }}
                      />
                    ) : (
                      // 待办
                      <UndoOutlined
                        className={dynamicStyle.todoIcon}
                        onClick={() => {
                          handleDoneOrDelete('mark', { id: dailyWork.id, state: 'INITIAL' });
                        }}
                      />
                    )}
                  </Col>
                  <Col span={4} style={{ paddingLeft: '8px', paddingTop: '2px' }}>
                    {/* 总结 */}
                    <SolutionOutlined className={dynamicStyle.summaryFoldedIcon} />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '12px', paddingTop: '1px' }}>
                    {/* 推到下一天 */}
                    <ArrowRightIcon
                      width={23}
                      height={24}
                      color={color}
                      margin="0 0 0 2px"
                      onClick={() => {
                        handleDoneOrDelete('push', { id: dailyWork.id });
                      }}
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '12px', paddingTop: '3px' }}>
                    <FullscreenOutlined
                      className={dynamicStyle.unFoldIcon}
                      onClick={() => {
                        setDailyWork({ ...dailyWork, foldFlag: 'YES' });
                        handleDoneOrDelete('fold', { id: dailyWork.id, state: 'unfold' });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
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
            style={{ height: dailyWork.foldFlag === 'YES' ? '114px' : '55px' }}
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
