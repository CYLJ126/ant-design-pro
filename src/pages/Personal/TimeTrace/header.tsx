import React, { useState } from 'react';
import { DatePicker, message, Row, Select } from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// 格式化时间为本地时间
import utc from 'dayjs/plugin/utc';
import styles from './header.less';
import { addTrace } from '@/services/ant-design-pro/dailyWork';
import { useTimeTraceData } from './TimeTraceContext';
import { debounce } from 'lodash';
import { useModel } from 'umi';

const dateFormat = 'YYYY-MM-DD';

export default function Header() {
  dayjs.extend(utc);
  const { fetchTraces, getSubTags, themeOptions, updateDate } = useTimeTraceData();
  const { foldFlag, setFoldFlag } = useModel('timeTraceFoldFlagModel');
  let tempParam = {
    themeId: null,
    workId: null,
    targetId: null,
  };
  const [requestParam, setRequestParam] = useState(tempParam);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [today, setToday] = useState(dayjs());
  debounce(() => updateDate(today), 5);

  function refresh(param, date?) {
    let dateStr = date ? date.format(dateFormat) : today.format(dateFormat);
    const req = { ...param, currentDate: dateStr };
    fetchTraces(req);
  }

  // 日期切换
  function toggleDay(type, value) {
    let newDay;
    if (type === 'set') {
      // 直接切换到指定日期
      newDay = value;
    } else {
      // 往前推一天或往后推一天
      newDay = today.add(type === 'former' ? -1 : 1, 'day');
    }
    updateDate(newDay);
    setToday(newDay);
    refresh(requestParam, newDay);
  }

  function addNewOne() {
    if (!requestParam.themeId) {
      message.warning('请选择主题');
      return;
    }
    let date = today.format(dateFormat);
    const newOne = {
      themeId: requestParam.themeId,
      workId: requestParam.workId,
      targetId: requestParam.targetId,
      startDate: date,
      endDate: date,
      completionRate: '0',
    };
    addTrace(newOne).then(() => {
      refresh(requestParam);
    });
  }

  return (
    <Row>
      {/* 向前一天 */}
      <VerticalRightOutlined
        className={styles.forwardWeek}
        onClick={() => {
          toggleDay('former', null);
        }}
      />
      {/* 当前日期 */}
      <DatePicker
        className={styles.date}
        value={today}
        format={dateFormat}
        onChange={(date) => {
          toggleDay('set', date);
        }}
      />
      {/* 向后一天 */}
      <VerticalLeftOutlined
        className={styles.forwardWeek}
        onClick={() => {
          toggleDay('latter', null);
        }}
      />
      {/* 新增 */}
      <PlusSquareOutlined className={styles.plusIcon} onClick={addNewOne} />
      {/* 刷新 */}
      <ReloadOutlined className={styles.refresh} onClick={() => refresh(requestParam)} />
      {/* 折叠/展开 */}
      {foldFlag ? (
        <FullscreenOutlined className={styles.foldIcon} onClick={() => setFoldFlag(false)} />
      ) : (
        <FullscreenExitOutlined className={styles.foldIcon} onClick={() => setFoldFlag(true)} />
      )}
      <Select
        allowClear
        className={styles.selectItem}
        style={{ width: '120px' }}
        placeholder="请选择主题"
        value={requestParam.themeId}
        options={themeOptions}
        onChange={(value) => {
          let newVar = { ...requestParam, themeId: value, workId: null, targetId: null };
          setRequestParam(newVar);
          refresh(newVar);
          if (value && value !== '') {
            getSubTags(value).then((result) => setWorkOptions(result));
          }
        }}
      />
      <Select
        allowClear
        className={styles.selectItem}
        style={{ width: '120px' }}
        placeholder="请选择事项"
        value={requestParam.workId}
        options={workOptions}
        onChange={(value) => {
          let newVar = { ...requestParam, workId: value, targetId: null };
          setRequestParam(newVar);
          refresh(newVar);
          if (value && value !== '') {
            getSubTags(value).then((result) => setTargetOptions(result));
          }
        }}
      />
      <Select
        allowClear
        className={styles.selectItem}
        style={{ width: '150px' }}
        placeholder="请选择目标"
        value={requestParam.targetId}
        options={targetOptions}
        onChange={(value) => {
          let newVar = { ...requestParam, targetId: value };
          setRequestParam(newVar);
          refresh(newVar);
        }}
      />
    </Row>
  );
}
