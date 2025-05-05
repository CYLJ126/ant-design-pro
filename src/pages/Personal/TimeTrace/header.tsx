import React, { useEffect, useState } from 'react';
import { DatePicker, message, Row, Select } from 'antd';
import { PlusSquareOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import styles from './header.less';
import { addTrace } from '@/services/ant-design-pro/dailyWork';
import { useTimeTraceData } from './TimeTraceContext';

const dateFormat = 'YYYY-MM-DD';

export default function Header({ listFunc }) {
  dayjs.extend(utc);
  const { getSubTags, themeOptions, currentDate, updateDate } = useTimeTraceData();
  let tempParam = {
    themeId: null,
    workId: null,
    targetId: null,
  };
  const [requestParam, setRequestParam] = useState(tempParam);
  const [workOptions, setWorkOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);

  function refresh(param, date?) {
    let dateStr = date ? date.format(dateFormat) : currentDate.format(dateFormat);
    const req = { ...param, currentDate: dateStr };
    listFunc(req);
  }

  // 日期切换
  function toggleDay(type, value) {
    let newDay;
    if (type === 'set') {
      // 直接切换到指定日期
      newDay = value;
    } else {
      // 往前推一天或往后推一天
      newDay = currentDate.add(type === 'former' ? -1 : 1, 'day');
    }
    updateDate(newDay);
    refresh(requestParam, newDay);
  }

  function addNewOne() {
    if (!requestParam.themeId) {
      message.warning('请选择主题');
      return;
    }
    let date = currentDate.format(dateFormat);
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

  useEffect(() => {
    refresh(requestParam);
  }, []);

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
        value={currentDate}
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
      <PlusSquareOutlined className={styles.plusItem} onClick={addNewOne} />
      <Select
        allowClear={true}
        className={styles.selectItem}
        style={{ width: '120px' }}
        placeholder="请选择主题"
        value={requestParam.themeId}
        options={themeOptions}
        onSelect={async (value) => {
          let newVar = { ...requestParam, themeId: value, workId: null, targetId: null };
          setRequestParam(newVar);
          setWorkOptions(await getSubTags(value));
          refresh(newVar);
        }}
      />
      <Select
        allowClear={true}
        className={styles.selectItem}
        style={{ width: '120px' }}
        placeholder="请选择事项"
        value={requestParam.workId}
        options={workOptions}
        onSelect={async (value) => {
          let newVar = { ...requestParam, workId: value, targetId: null };
          setRequestParam(newVar);
          setTargetOptions(await getSubTags(value));
          refresh(newVar);
        }}
      />
      <Select
        allowClear={true}
        className={styles.selectItem}
        style={{ width: '150px' }}
        placeholder="请选择目标"
        value={requestParam.targetId}
        options={targetOptions}
        onSelect={async (value) => {
          let newVar = { ...requestParam, targetId: value };
          setRequestParam(newVar);
          refresh(newVar);
        }}
      />
    </Row>
  );
}
