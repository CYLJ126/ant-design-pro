import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select, Splitter } from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SolutionOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import activityStyle from './activityStyle';
import styles from './activity.less';
import { foldActivity, getTargetsForDaily } from '@/services/ant-design-pro/dailyWork';
import { getSummaryById, getTags, saveSummary } from '@/services/ant-design-pro/base';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';
import DeleteIcon from '@/icons/DeleteIcon';
import ArrowRightIcon from '@/icons/ArrowRightIcon';
import SuccessIcon from '@/icons/SuccessIcon';
import Time from './time';
import { useModel } from '@@/exports';

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function Activity({ dailyWorkParam }) {
  const [dailyWork, setDailyWork] = useState({ ...dailyWorkParam });
  const { updateActivity, pushNextDay, markDone, deleteActivity } = useModel('activitiesModel');
  const { setUpdateInfo } = useModel('activityUpdateModel');
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [summary, setSummary] = useState({
    type: 'daily_work',
    targetId: dailyWork.id,
    content: '',
  });
  const [sizes, setSizes] = React.useState<(number | string)[]>(['100%', '0%']);
  const { styles: dynamicStyle } = activityStyle(dailyWork.status);
  const color = dailyWork.status === 'DONE' ? '#6294a5' : '#81d3f8';

  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
        if (!dailyWork.themeId) {
          setDailyWork({ ...dailyWork, themeId: result[0]?.value });
        }
      });
    });
    // 获取总结内容
    getSummaryById('daily_work', dailyWork.id).then((result) => {
      setSummary(result ?? { type: 'daily_work', targetId: dailyWork.id, content: '' });
      if (result?.content) {
        // 如果有总结，则显示总结，占比 30%
        setSizes(['70%', '30%']);
      }
    });
  }, []);

  useEffect(() => {
    // 日课主题下拉变化时，获取事项下拉
    if (dailyWork?.themeId) {
      getSubTags({ fatherId: dailyWork.themeId }).then((result) => {
        setWorkOptions(result);
        if (!dailyWork.workId) {
          setDailyWork({ ...dailyWork, workId: result[0]?.value });
        }
      });
    }
  }, [dailyWork.themeId]);

  useEffect(() => {
    // 日课事项下拉变化时，获取目标下拉
    if (dailyWork?.workId) {
      getTargetsForDaily({
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
              save={updateActivity}
            />
          </Row>
          <Row>
            <Time
              showLine={true}
              dailyWork={{ ...dailyWork, mark: 'endTime', placeholder: '结束时间' }}
              save={updateActivity}
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
                          updateActivity(temp);
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
                        onBlur={() => {
                          updateActivity(dailyWork).then(() => {
                            setUpdateInfo({ id: dailyWork.id, date: new Date() });
                          });
                        }}
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
                        onBlur={() => {
                          updateActivity(dailyWork).then(() => {
                            setUpdateInfo({ id: dailyWork.id, date: new Date() });
                          });
                        }}
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
                        onBlur={() => {
                          updateActivity(dailyWork).then(() => {
                            setUpdateInfo({ id: dailyWork.id, date: new Date() });
                          });
                        }}
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
                    updateActivity(temp);
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
                      deleteActivity(dailyWork.id).then(() => {
                        setUpdateInfo({ id: dailyWork.id, date: new Date() });
                      });
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
                        markDone(dailyWork.id, 'DONE').then(() => {
                          setUpdateInfo({ id: dailyWork.id, date: new Date() });
                        });
                      }}
                    />
                  ) : (
                    // 待办
                    <UndoOutlined
                      className={dynamicStyle.todoIcon}
                      onClick={() => {
                        markDone(dailyWork.id, 'INITIAL').then(() => {
                          setUpdateInfo({ id: dailyWork.id, date: new Date() });
                        });
                      }}
                    />
                  )}
                  {/* 折叠 */}
                  <FullscreenExitOutlined
                    className={dynamicStyle.foldIcon}
                    onClick={() => {
                      setDailyWork({ ...dailyWork, foldFlag: 'NO' });
                      foldActivity(dailyWork.id, 'NO').then();
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
                      pushNextDay(dailyWork);
                    }}
                  />
                </Row>
                <Row>
                  {/* 总结 */}
                  <SolutionOutlined
                    className={dynamicStyle.summaryIcon}
                    onClick={() => setSizes(['50%', '50%'])}
                  />
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
                  onBlur={() => {
                    updateActivity(dailyWork).then(() => {
                      setUpdateInfo({ id: dailyWork.id, date: new Date() });
                    });
                  }}
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
                  onBlur={() => {
                    updateActivity(dailyWork).then(() => {
                      setUpdateInfo({ id: dailyWork.id, date: new Date() });
                    });
                  }}
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
                  onBlur={() => {
                    updateActivity(dailyWork).then(() => {
                      setUpdateInfo({ id: dailyWork.id, date: new Date() });
                    });
                  }}
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
                        deleteActivity(dailyWork.id);
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
                          markDone(dailyWork.id, 'DONE');
                        }}
                      />
                    ) : (
                      // 待办
                      <UndoOutlined
                        className={dynamicStyle.todoIcon}
                        onClick={() => {
                          markDone(dailyWork.id, 'INITIAL');
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
                        pushNextDay(dailyWork);
                      }}
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '12px', paddingTop: '3px' }}>
                    <FullscreenOutlined
                      className={dynamicStyle.unFoldIcon}
                      onClick={() => {
                        setDailyWork({ ...dailyWork, foldFlag: 'YES' });
                        foldActivity(dailyWork.id, 'YES').then();
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
                updateActivity(temp);
              }}
            />
          </Row>
        </Col>
        <Col span={15}>
          <Splitter style={{ paddingLeft: '4px' }} onResize={setSizes}>
            <Splitter.Panel collapsible size={sizes[0]} min="30%" max="70%">
              <Input.TextArea
                value={dailyWork.content}
                style={{ height: dailyWork.foldFlag === 'YES' ? '114px' : '55px' }}
                className={dynamicStyle.content}
                onChange={(e) => setDailyWork({ ...dailyWork, content: e.target.value })}
                onBlur={() => updateActivity(dailyWork)}
              />
            </Splitter.Panel>
            <Splitter.Panel collapsible size={sizes[1]} min="30%" max="70%">
              <Input.TextArea
                value={summary.content}
                style={{ height: dailyWork.foldFlag === 'YES' ? '114px' : '55px' }}
                className={dynamicStyle.content}
                onChange={(e) =>
                  setSummary({
                    ...summary,
                    type: 'daily_work',
                    targetId: dailyWork.id,
                    content: e.target.value,
                  })
                }
                onBlur={() => saveSummary(summary)}
              />
            </Splitter.Panel>
          </Splitter>
        </Col>
      </Row>
      <Row>
        <hr className={dynamicStyle.separator} />
      </Row>
    </div>
  );
}
