import React, { useEffect, useState } from 'react';
import { DatePicker, Row } from 'antd';
import {
  ExportOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import styles from './header.less';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import { useModel } from 'umi';
import { listActivities } from '@/models/activitiesModel';

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
  const { initialActivities, addNewActivity } = useModel('activitiesModel');
  const { updateInfo } = useModel('activityUpdateModel');

  /**
   * 统计头部信息
   */
  async function statisticsHeadInfo(date) {
    const result = await listActivities(date);
    let temp = { ...initialHeadInfo };
    result.forEach((activity) => {
      if (activity.status === 2) {
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
    // 设置占比颜色
    if (temp.proportion < 100) {
      document.documentElement.style.setProperty('--daily-percent-color', '#81d3f8');
    } else if (temp.proportion > 100) {
      document.documentElement.style.setProperty('--daily-percent-color', '#ff0000');
    } else {
      document.documentElement.style.setProperty('--daily-percent-color', '#5bb1c9');
    }
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
    statisticsHeadInfo(newDay).then();
  }

  useEffect(() => {
    initialActivities(whichDay);
  }, []);

  useEffect(() => {
    statisticsHeadInfo(whichDay).then();
  }, [initialActivities, updateInfo]);

  return (
    <div>
      <Row>
        {/* 向前一天 */}
        <VerticalRightOutlined
          className={styles.switchDay}
          onClick={() => toggleDay('former', null)}
        />
        {/* 当前日期 */}
        <DatePicker
          className={styles.date}
          value={dayjs(whichDay)}
          format={dateFormat}
          onChange={(date) => {
            toggleDay('set', date);
          }}
        />
        {/* 向后一天 */}
        <VerticalLeftOutlined
          className={styles.switchDay}
          onClick={() => toggleDay('latter', null)}
        />
        {/* 得分 */}
        <span className={styles.dailyScore}>{'' + headInfo.score + '分'}</span>
        {/* 小时数 */}
        <span className={styles.dailyScore}>{'' + headInfo.cost + 'h'}</span>
        {/* 占比 */}
        <span key={new Date().getTime()} className={styles.proportion}>
          {'' + headInfo.proportion + '%'}
        </span>
        {/* 完成项 */}
        <span className={`${styles.itemCount} ${styles.completedItems}`}>
          {'完成项 - ' + headInfo.completedWork}
        </span>
        {/* 待办项 */}
        <span className={`${styles.itemCount} ${styles.todoItems}`}>
          {'待办项 - ' + headInfo.todoWork}
        </span>
        {/* 刷新 */}
        <ReloadOutlined onClick={() => statisticsHeadInfo(whichDay)} className={styles.refresh} />
        {/* 新增 */}
        <PlusSquareOutlined className={styles.plusItem} onClick={() => addNewActivity(whichDay)} />
        {/* 总结 */}
        <ExportOutlined className={styles.showSummary} />
      </Row>
    </div>
  );
}
