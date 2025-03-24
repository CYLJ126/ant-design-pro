import React, { useEffect, useState } from 'react';
import Header from './header';
import { Col, Row } from 'antd';
import styles from './index.less';
import Activity from './activity';
import { listDailyWork } from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import utc from 'dayjs-plugin-utc';
import 'dayjs/locale/zh-cn';
import TodoWorkWrap from '@/pages/Personal/DailyWork/todoWorkWrap';
import KeepAlive from 'react-activation';

const initialHeadInfo = {
  score: 0,
  cost: 0,
  proportion: 0,
  todoWork: 0,
  completedWork: 0,
};

function DailyWork() {
  const [whichDay, setWhichDay] = useState(new Date());
  const [dailyWorks, setDailyWorks] = useState([]);
  const [headInfo, setHeadInfo] = useState(initialHeadInfo);
  dayjs.extend(utc);

  function toggleDay(type, value) {
    if (type === 'set') {
      // 直接切换到指定日期
      setWhichDay(value.toDate());
    } else {
      // 往前推一天或往后推一天
      let temp = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate());
      temp.setDate(whichDay.getDate() + (type === 'former' ? -1 : 1));
      setWhichDay(temp);
    }
  }

  /**
   * 统计头部信息
   *
   * @param param 日课列表
   */
  function statisticsHeadInfo(param) {
    let temp = { ...initialHeadInfo };
    param.forEach((activity) => {
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

  function postUpdate() {
    let start = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate(), 0, 0, 0);
    let end = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate(), 23, 59, 59);
    start = dayjs(start).utc().local().format('YYYY-MM-DD HH:mm:ss');
    end = dayjs(end).utc().local().format('YYYY-MM-DD HH:mm:ss');
    listDailyWork({ startDateTimeCeil: start, startDateTimeFloor: end }).then((result) => {
      // 如果只是局部更改数据，则不需要刷新整个日课列表
      setDailyWorks(result);
      statisticsHeadInfo(result);
    });
  }

  function addBlankDailyWork(date) {
    const blankOne = {
      status: 'DOING',
      proportion: 0,
      startTime: date,
      endTime: date,
      score: 0,
      cost: 0,
      foldFlag: 'YES',
      content: '',
    };
    const list = [];
    list.push(blankOne);
    list.push(...dailyWorks);
    setDailyWorks(list);
  }

  useEffect(() => {
    postUpdate();
  }, [whichDay]);

  const time = new Date().getTime();
  return (
    <div>
      <hr className={styles.vertical} />
      <Row>
        <Col span={18}>
          <Header
            whichDay={whichDay}
            add={addBlankDailyWork}
            headInfo={headInfo}
            toggleDay={toggleDay}
            refresh={() => statisticsHeadInfo(dailyWorks)}
          />
          <hr className={styles.horizontal} />
          {dailyWorks.map((item) => {
            return <Activity key={item.id + time} dailyWorkParam={item} postUpdate={postUpdate} />;
          })}
        </Col>
        <Col span={6}>
          <TodoWorkWrap />
        </Col>
      </Row>
    </div>
  );
}

export default () => {
  return (
    <KeepAlive name="dailyWork">
      <DailyWork />
    </KeepAlive>
  );
};
