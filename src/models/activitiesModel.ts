import { useCallback, useState } from 'react';
import {
  addDailyWorkBack,
  deleteDailyWork,
  listDailyWork,
  markDoneBack,
  updateDailyWork,
} from '@/services/ant-design-pro/dailyWork';
import dayjs from 'dayjs';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';
import { message } from 'antd';

export async function listActivities(whichDay) {
  let start = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate(), 0, 0, 0);
  let end = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate(), 23, 59, 59);
  start = dayjs(start).utc().local().format('YYYY-MM-DD HH:mm:ss');
  end = dayjs(end).utc().local().format('YYYY-MM-DD HH:mm:ss');
  return await listDailyWork({ startDateTimeCeil: start, startDateTimeFloor: end });
}

export default () => {
  // 每日活动列表
  const [activities, setActivities] = useState({});

  // 初始化活动列表
  const initialActivities = useCallback(async (whichDay) => {
    const result = await listActivities(whichDay);
    let activitiesTemp = {};
    result.forEach((item) => {
      activitiesTemp[item.id] = item;
    });
    setActivities(activitiesTemp);
  }, []);

  // 添加新活动
  const addNewActivity = useCallback(
    async (whichDay) => {
      let date = new Date(whichDay.getFullYear(), whichDay.getMonth(), whichDay.getDate(), 0, 0, 0);
      const dateStr = dayjs(date).utc().local().format('YYYY-MM-DD HH:mm:ss');
      const blankOne = {
        status: 'INITIAL',
        proportion: 0,
        startTime: dateStr,
        endTime: dateStr,
        score: 0,
        cost: 0,
        foldFlag: 'YES',
        content: '',
      };
      const newOne = await addDailyWorkBack(blankOne);
      let activitiesTemp = { ...activities };
      activitiesTemp[newOne.id] = newOne;
      setActivities(activitiesTemp);
    },
    [activities],
  );

  // 删除活动
  const deleteActivity = useCallback(
    async (activityId) => {
      deleteDailyWork(activityId).then((result) => {
        if (result) {
          let activitiesTemp = { ...activities };
          delete activitiesTemp[activityId];
          setActivities(activitiesTemp);
        } else {
          message.error('活动' + activityId + ' 删除失败！');
        }
      });
    },
    [activities],
  );

  // 向后端更新活动
  const updateActivity = useCallback(async (param) => {
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
    updateDailyWork(data).then((result) => {
      if (result) {
        if (param.mark) {
          initialActivities(new Date(param.startTime));
        }
      } else {
        message.error('更新失败！');
      }
    });
  }, []);

  // 向后端更新活动状态
  const markDone = useCallback(async (id, state) => {
    markDoneBack(id, state).then((result) => {
      if (!result) {
        message.error('状态更新失败！');
      }
    });
  }, []);

  // 复制一个新活动到下一天
  const pushNextDay = useCallback(async (dailyWork) => {
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
      startTime: startTimeStr,
      endTime: endTimeStr,
    };
    addDailyWorkBack(newOne).then();
  }, []);

  return {
    activities,
    initialActivities,
    addNewActivity,
    deleteActivity,
    updateActivity,
    pushNextDay,
    markDone,
  };
};
