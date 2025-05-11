import React, { useEffect, useState } from 'react';
import { Col, Input, InputNumber, Row, Select, Splitter } from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SolutionOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import styles from './activity.less';
import activityDone from './activityDone.less';
import activityInitial from './activityInitial.less';
import {
  foldActivity,
  getDailyWorkById,
  getTargetsForDaily,
} from '@/services/ant-design-pro/dailyWork';
import { getTags, saveSummary } from '@/services/ant-design-pro/base';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';
import DeleteIcon from '@/icons/DeleteIcon';
import ArrowRightIcon from '@/icons/ArrowRightIcon';
import SuccessIcon from '@/icons/SuccessIcon';
import Time from './time';
import { useModel } from 'umi';

async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export default function Activity({ id }) {
  const [dailyWork, setDailyWork] = useState<any>({ id: id, foldFlag: 'YES' });
  const { updateActivity, pushNextDay, markDone, deleteActivity } = useModel('activitiesModel');
  const [themeOptions, setThemeOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [sizes, setSizes] = React.useState<(number | string)[]>(['100%', '0%']);
  const color = dailyWork.status === 'DONE' ? '#5cb3cc' : '#81d3f8';

  const getStyles = () => {
    return dailyWork.status === 'DONE' ? activityDone : activityInitial;
  };
  useEffect(() => {
    // 日课主题下拉内容，为标签“日课”的子标签
    getSubTags({ name: '日课' }).then((rootTag) => {
      getSubTags({ fatherId: rootTag[0].value }).then((result) => {
        setThemeOptions(result);
      });
    });
    getDailyWorkById({ activityId: id }).then((result) => {
      if (result) {
        setDailyWork({
          id: result.id,
          themeId: result.themeId,
          workId: result.workId,
          targetId: result.targetId,
          status: result.status,
          score: result.score,
          cost: result.cost,
          proportion: result.proportion,
          foldFlag: result.foldFlag,
          content: result.content,
          startTime: result.startTime,
          endTime: result.endTime,
          summaryId: result.summaryId,
          summary: result.summary,
        });
        if (result.summary) {
          // 如果有总结，则显示总结，占比 30%
          setSizes(['70%', '30%']);
        }
        if (result.themeId) {
          // 获取事项下拉
          getSubTags({ fatherId: result.themeId }).then((result) => {
            setWorkOptions(result);
          });
        }
        if (result.workId) {
          // 获取目标下拉
          getTargetsForDaily({
            workId: result.workId,
            whichDay: dayjs(result.startTime).utc().local().format('YYYY-MM-DD'),
          }).then((result) => {
            setTargetOptions(
              result.map((item) => {
                return { value: item.id, label: item.target };
              }),
            );
          });
        }
      }
    });
  }, []);

  return (
    <div className={`${styles.activity} ${getStyles().activity}`}>
      <Row>
        <Col span={2}>
          <Row style={{ marginBottom: dailyWork.foldFlag === 'YES' ? '64px' : '5px' }}>
            <Time
              showLine={true}
              timeParam={dayjs(dailyWork.startTime)}
              mark="startTime"
              colorStyles={getStyles()}
              save={(time) => {
                updateActivity({ ...dailyWork, startTime: time, refreshFlag: true });
              }}
            />
          </Row>
          <Row>
            <Time
              showLine={true}
              timeParam={dayjs(dailyWork.endTime)}
              mark="endTime"
              colorStyles={getStyles()}
              save={(time) => {
                updateActivity({ ...dailyWork, endTime: time });
              }}
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
                        className={`${styles.theme} ${getStyles().theme}`}
                        options={themeOptions}
                        onChange={(value) => {
                          const temp = { ...dailyWork, themeId: value, workId: '', targetId: '' };
                          setDailyWork(temp);
                          updateActivity(temp);
                          // 日课主题下拉变化时，获取事项下拉
                          getSubTags({ fatherId: value }).then((result) => {
                            setWorkOptions(result);
                          });
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        className={`${styles.number} ${getStyles().number}`}
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
                          updateActivity(dailyWork);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <InputNumber
                        className={`${styles.number} ${getStyles().number}`}
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
                          updateActivity(dailyWork);
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        className={`${styles.number} ${getStyles().number}`}
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
                          updateActivity(dailyWork);
                        }}
                      />
                    </Col>
                  </Row>
                </Row>
                <Select
                  value={dailyWork.workId}
                  size={'small'}
                  className={`${styles.work} ${getStyles().workAndTarget}`}
                  options={workOptions}
                  onChange={(value) => {
                    const temp = { ...dailyWork, workId: value, targetId: '' };
                    setDailyWork(temp);
                    updateActivity(temp);
                    // 日课事项下拉变化时，获取目标下拉
                    getTargetsForDaily({
                      workId: value,
                      whichDay: dayjs(dailyWork.startTime).utc().local().format('YYYY-MM-DD'),
                    }).then((result) => {
                      setTargetOptions(
                        result.map((item) => {
                          return { value: item.id, label: item.target };
                        }),
                      );
                    });
                  }}
                />
              </Col>
              <Col span={12} style={{ paddingLeft: '10px' }}>
                <Row>
                  {/* 删除 */}
                  <DeleteIcon
                    className={`${styles.deleteUnFoldIcon} ${getStyles().icon}`}
                    onClick={() => {
                      deleteActivity(dailyWork.id);
                    }}
                  />
                  {dailyWork.status === 'INITIAL' ? (
                    // 完成
                    <SuccessIcon
                      width={20}
                      height={20}
                      color={color}
                      margin="4px 0 0 4px"
                      onClick={() => {
                        markDone(dailyWork.id, 'DONE').then(() => {
                          setDailyWork({ ...dailyWork, status: 'DONE' });
                        });
                      }}
                    />
                  ) : (
                    // 待办
                    <UndoOutlined
                      className={`${styles.todoUnfoldIcon} ${getStyles().icon}`}
                      onClick={() => {
                        markDone(dailyWork.id, 'INITIAL').then(() => {
                          setDailyWork({ ...dailyWork, status: 'INITIAL' });
                        });
                      }}
                    />
                  )}
                  {/* 折叠 */}
                  <FullscreenExitOutlined
                    className={`${styles.foldIcon} ${getStyles().icon}`}
                    onClick={() => {
                      setDailyWork({ ...dailyWork, foldFlag: 'NO' });
                      foldActivity(dailyWork.id, 'NO').then();
                    }}
                  />
                </Row>
                <Row>
                  {/* 推到下一天 */}
                  <ArrowRightIcon
                    className={`${styles.pushUnfoldIcon} ${getStyles().pushIcon}`}
                    onClick={() => {
                      pushNextDay(dailyWork);
                    }}
                  />
                  {/* 总结 */}
                  <SolutionOutlined
                    className={`${styles.summaryIcon} ${getStyles().icon}`}
                    onClick={() => setSizes(['50%', '50%'])}
                  />
                </Row>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={4}>
                <InputNumber
                  className={`${styles.number} ${getStyles().number}`}
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
                    updateActivity(dailyWork);
                  }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  className={`${styles.number} ${getStyles().number}`}
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
                    updateActivity(dailyWork);
                  }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  className={`${styles.number} ${getStyles().number}`}
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
                    updateActivity(dailyWork);
                  }}
                />
              </Col>
              <Col span={12}>
                <Row style={{ marginBottom: '-1px' }}>
                  <Col span={4}>
                    {/* 删除 */}
                    <DeleteIcon
                      className={`${styles.deleteFoldIcon} ${getStyles().icon}`}
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
                          markDone(dailyWork.id, 'DONE').then(() => {
                            setDailyWork({ ...dailyWork, status: 'DONE' });
                          });
                        }}
                      />
                    ) : (
                      // 待办
                      <UndoOutlined
                        className={`${styles.todoFoldIcon} ${getStyles().icon}`}
                        onClick={() => {
                          markDone(dailyWork.id, 'INITIAL').then(() => {
                            setDailyWork({ ...dailyWork, status: 'INITIAL' });
                          });
                        }}
                      />
                    )}
                  </Col>
                  <Col span={4} style={{ paddingLeft: '8px', paddingTop: '2px' }}>
                    {/* 总结 */}
                    <SolutionOutlined
                      className={`${styles.summaryFoldedIcon} ${getStyles().icon}`}
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '12px', paddingTop: '1px' }}>
                    {/* 推到下一天 */}
                    <ArrowRightIcon
                      className={`${styles.pushFoldIcon} ${getStyles().pushIcon}`}
                      onClick={() => {
                        pushNextDay(dailyWork);
                      }}
                    />
                  </Col>
                  <Col span={4} style={{ paddingLeft: '12px', paddingTop: '3px' }}>
                    <FullscreenOutlined
                      className={`${styles.unFoldIcon} ${getStyles().icon}`}
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
              className={`${styles.target} ${getStyles().workAndTarget}`}
              options={targetOptions}
              onChange={(value) => {
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
                className={`${styles.content} ${getStyles().content}`}
                onChange={(e) => setDailyWork({ ...dailyWork, content: e.target.value })}
                onBlur={() => updateActivity(dailyWork)}
              />
            </Splitter.Panel>
            <Splitter.Panel collapsible size={sizes[1]} min="30%" max="70%">
              <Input.TextArea
                value={dailyWork.summary}
                style={{ height: dailyWork.foldFlag === 'YES' ? '114px' : '55px' }}
                className={`${styles.content} ${getStyles().content}`}
                onChange={(e) =>
                  setDailyWork({
                    ...dailyWork,
                    summary: e.target.value,
                  })
                }
                onBlur={() =>
                  saveSummary({
                    type: 'daily_work',
                    targetId: dailyWork.id,
                    content: dailyWork.summary,
                    id: dailyWork.summaryId,
                  })
                }
              />
            </Splitter.Panel>
          </Splitter>
        </Col>
      </Row>
      <Row>
        <hr className={`${styles.separator} ${getStyles().separator}`} />
      </Row>
    </div>
  );
}
