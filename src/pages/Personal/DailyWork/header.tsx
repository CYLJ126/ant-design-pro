import React, { useEffect, useState } from 'react';
import { DatePicker, Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  SendOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import headerStyle from './headerStyle';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import { useModel } from 'umi';
import { listActivities } from '@/models/activitiesModel';
import { useNavigate } from 'react-router-dom';

const dateFormat = 'YYYY-MM-DD';

const initialHeadInfo = {
  score: 0,
  cost: 0,
  proportion: 0,
  todoWork: 0,
  completedWork: 0,
};

export default function Header() {
  dayjs.extend(utc);
  const [whichDay, setWhichDay] = useState(new Date());
  const [headInfo, setHeadInfo] = useState(initialHeadInfo);
  const { styles: dynamicStyle } = headerStyle(headInfo);
  const { initialActivities, addNewActivity } = useModel('activitiesModel');
  const { updateInfo } = useModel('activityUpdateModel');
  const navigateTo = useNavigate();

  /**
   * 统计头部信息
   */
  async function statisticsHeadInfo() {
    const result = await listActivities(whichDay);
    let temp = { ...initialHeadInfo };
    result.forEach((activity) => {
      if (activity.status === 'DONE') {
        temp.completedWork++;
      } else {
        temp.todoWork++;
      }
      temp.proportion += activity.proportion;
      temp.cost += activity.cost;
      temp.score += (activity.proportion / 100) * activity.score;
    });
    // 四舍五入两位小数
    temp.score = parseFloat(temp.score.toFixed(2));
    setHeadInfo(temp);
  }

  // 日期切换
  function toggleDay(type, value) {
    let newDay;
    if (type === 'set') {
      // 直接切换到指定日期
      newDay = value.toDate();
    } else {
      // 往前推一天或往后推一天
      let temp = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate());
      temp.setDate(whichDay.getDate() + (type === 'former' ? -1 : 1));
      newDay = temp;
    }
    setWhichDay(newDay);
    initialActivities(newDay);
    statisticsHeadInfo().then();
  }

  useEffect(() => {
    initialActivities(whichDay);
  }, []);

  useEffect(() => {
    statisticsHeadInfo().then();
  }, [initialActivities, updateInfo]);

  return (
    <div>
      <Row>
        {/* 向前一天 */}
        <VerticalRightOutlined
          className={dynamicStyle.forwardWeek}
          onClick={() => toggleDay('former', null)}
        />
        {/* 当前日期 */}
        <DatePicker
          className={dynamicStyle.date}
          value={dayjs(whichDay)}
          format={dateFormat}
          onChange={(date) => {
            toggleDay('set', date);
          }}
        />
        {/* 向后一天 */}
        <VerticalLeftOutlined
          className={dynamicStyle.forwardWeek}
          onClick={() => toggleDay('latter', null)}
        />
        {/* 得分 */}
        <span className={dynamicStyle.dailyScore}>{'' + headInfo.score + '分'}</span>
        {/* 小时数 */}
        <span className={dynamicStyle.dailyScore}>{'' + headInfo.cost + 'h'}</span>
        {/* 占比 */}
        <span key={new Date().getTime()} className={dynamicStyle.proportion}>
          {'' + headInfo.proportion + '%'}
        </span>
        {/* 完成项 */}
        <span className={`${dynamicStyle.itemCount} ${dynamicStyle.completedItems}`}>
          {'完成项 - ' + headInfo.completedWork}
        </span>
        {/* 待办项 */}
        <span className={`${dynamicStyle.itemCount} ${dynamicStyle.todoItems}`}>
          {'待办项 - ' + headInfo.todoWork}
        </span>
        {/* 刷新 */}
        <ReloadOutlined onClick={statisticsHeadInfo} className={dynamicStyle.refresh} />
        {/* 新增 */}
        <PlusSquareOutlined
          className={dynamicStyle.plusItem}
          onClick={() => addNewActivity(whichDay)}
        />
        {/* 总结 */}
        <ExportOutlined className={dynamicStyle.showSummary} />
        {/* 跳转到周计划 */}
        <SendOutlined
          className={dynamicStyle.myIconJump}
          onClick={() => {
            navigateTo('/Personal/WeeklyWork');
          }}
        />
      </Row>
    </div>
  );
}
