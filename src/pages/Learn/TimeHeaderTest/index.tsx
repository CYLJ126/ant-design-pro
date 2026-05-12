import React, { useState } from 'react';
import TimeHeader, { MyTime } from '@/components/TimeHeader';
import DailyActions from './dailyActions';
import WeeklyActions from './weeklyActions';
import dayjs from 'dayjs';
import { getWeekInfo } from '@/utils/weekUtil';
import styles from './index.less';

const DailyPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<MyTime>({
    type: 'day',
    value: dayjs(),
    time: dayjs(),
    label: dayjs().format('YYYY-MM-DD'),
  });
  const [currentMinute, setCurrentMinute] = useState<MyTime>({
    type: 'minute',
    value: dayjs(),
    time: dayjs(),
    label: dayjs().format('YYYY-MM-DD HH:mm'),
  });
  const [currentHour, setCurrentHour] = useState<MyTime>({
    type: 'hour',
    value: dayjs(),
    time: dayjs(),
    label: dayjs().format('YYYY-MM-DD HH'),
  });
  const weekInfo = getWeekInfo(currentDate.time);
  const [currentWeek, setCurrentWeek] = useState<MyTime>({
    type: 'week',
    value: weekInfo.value,
    time: dayjs(),
    label: `第 ${weekInfo.value} 周`,
  });
  const [headInfo] = useState({
    score: 7,
    cost: 30,
    proportion: 80,
    todoWork: 2,
    completedWork: 3,
  });
  const [weekInfoMock] = useState({
    score: 6,
    proportion: 50,
    completedWork: 2,
    todoWork: 3,
    overdueWork: 1,
  });

  // 处理分钟数变化
  const handleMinuteChange = (time: MyTime, type: 'set' | 'prev' | 'next') => {
    console.log('分钟数变化：', time, type);
    setCurrentMinute(time);
  };

  // 处理小时数变化
  const handleHourChange = (time: MyTime, type: 'set' | 'prev' | 'next') => {
    console.log('小时数变化：', time, type);
    setCurrentHour(time);
  };

  // 处理天数变化
  const handleDateChange = (time: MyTime, type: 'set' | 'prev' | 'next') => {
    console.log('天数变化：', time, type);
    setCurrentDate(time);
  };

  // 处理周数变化
  const handleWeekChange = (myTime: MyTime, type: 'set' | 'prev' | 'next') => {
    console.log('周数变化：', myTime, type);
    setCurrentWeek(myTime);
  };

  // 动态主题配置
  const getTheme = () => {
    const proportion = headInfo.proportion;
    let proportionColor = '#81d3f8';

    if (proportion < 100) {
      proportionColor = '#81d3f8';
    } else if (proportion > 100) {
      proportionColor = '#ff0000';
    } else {
      proportionColor = '#5bb1c9';
    }

    return {
      primaryColor: '#81d3f8',
      backgroundColor: '#81d3f8',
      textColor: 'white',
      proportionColor,
    };
  };

  return (
    <div>
      <TimeHeader
        myTime={currentMinute}
        onTimeChange={handleMinuteChange}
        className={styles.timeHeader}
      />
      <TimeHeader
        myTime={currentHour}
        onTimeChange={handleHourChange}
        className={styles.timeHeader}
      />
      <TimeHeader
        myTime={currentDate}
        onTimeChange={handleDateChange}
        theme={getTheme()}
        className={styles.timeHeader}
      >
        <DailyActions
          score={headInfo.score}
          cost={headInfo.cost}
          proportion={headInfo.proportion}
          todoWork={headInfo.todoWork}
          completedWork={headInfo.completedWork}
          onRefresh={() => {
            console.log('刷新');
          }}
          onAddNew={() => {
            console.log('添加新活动');
          }}
          onSummary={() => {
            console.log('总结');
          }}
          theme={getTheme()}
        />
      </TimeHeader>

      <TimeHeader
        myTime={currentWeek}
        onTimeChange={handleWeekChange}
        theme={getTheme()}
        className={styles.timeHeader}
      >
        <WeeklyActions
          score={weekInfoMock.score}
          proportion={weekInfoMock.proportion}
          completedWork={weekInfoMock.completedWork}
          todoWork={weekInfoMock.todoWork}
          overdueWork={weekInfoMock.overdueWork}
          onAddNew={() => {
            console.log('添加新目标');
          }}
          onStatistics={() => {
            console.log('统计');
          }}
          onRefresh={() => {
            console.log('刷新');
          }}
          onSummary={() => {
            console.log('总结');
          }}
          theme={getTheme()}
        />
      </TimeHeader>
      <TimeHeader className={styles.timeHeader} />
      <TimeHeader className={styles.timeHeader} />
      <TimeHeader className={styles.timeHeader} />
      <TimeHeader className={styles.timeHeader} />
    </div>
  );
};

export default DailyPage;
