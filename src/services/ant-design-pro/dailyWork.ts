import { jsonPost } from './api';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';

/**  ----------------- WeeklyDaysController start ----------------- */
/**
 * #返回当前周对应的表头，即周一到周天
 *
 * @param weekId 第几周
 */
export async function getWeekDaysHeader(weekId?: number) {
  return jsonPost('/dw/weeklyDays/listWeekDaysHeader', { weekId: weekId });
}

/**
 * #查询当前日期是一年中的第几周
 *
 * @param date 日期
 */
export async function getWhichWeek(date) {
  return jsonPost('/dw/weeklyDays/whichWeek', { date: date });
}

/**
 * #获取指定目标的每周进度数据
 *
 * @param targetId 指定事项 ID
 * @param weekId 指定周 ID
 */
export async function listWeekDays(targetId?: number, weekId?: number) {
  return jsonPost('/dw/weeklyDays/listWeekDays', { targetId: targetId, weekId: weekId });
}

/**
 * 更新对应天数的进度数据
 *
 * @param dayData 对应天数的进度数据
 */
export async function updateDayData(dayData) {
  return jsonPost('/dw/weeklyDays/updateDayData', dayData);
}

/**  ----------------- WeeklyDaysController end ----------------- */

/**  ----------------- WeeklyWorkController start ----------------- */

/**
 * #返回指定周对应的统计数据
 *
 * @param weekId 第几周
 */
export async function getWeekStatistics(weekId?: number) {
  return jsonPost('/dw/weeklyWork/statistics', { weekId: weekId });
}

/**
 * #返回指定周的目标列表
 *
 * @param param 请求参数
 */
export async function getTargets(param) {
  return jsonPost('/dw/weeklyWork/listTargets', param);
}

/**
 * #添加新目标，并返回
 */
export async function addTarget(weekId?: number) {
  return jsonPost('/dw/weeklyWork/addTarget', { weekId: weekId });
}

/**
 * #删除指定目标
 */
export async function deleteTarget(target) {
  return jsonPost('/dw/weeklyWork/deleteTarget', target);
}

/**
 * #返回当前周的目标列表
 *
 */
export async function getCurrentWeekTargets() {
  return jsonPost('/dw/weeklyWork/listCurrentTargets', {});
}

/**
 * 更新当前目标信息
 *
 */
export async function updateWeeklyWork(headInfo) {
  return jsonPost('/dw/weeklyWork/updateWeeklyWork', headInfo);
}

/**  ----------------- WeeklyWorkController end ----------------- */

/**  ----------------- StepsController start ----------------- */

/**
 * 返回目标的步骤
 *
 * @param targetId 事项 id
 */
export async function getSteps(targetId?: number) {
  return jsonPost('/dw/steps/listSteps', { targetId: targetId });
}

/**
 * 返回目标的步骤
 *
 * @param steps 步骤列表
 */
export async function saveSteps(steps) {
  return jsonPost('/dw/steps/saveSteps', steps);
}

/**  ----------------- StepsController end ----------------- */

/**  ----------------- DailyWorkController start ----------------- */

/**
 * 展示日课列表
 * @param param 请求参数
 */
export async function listDailyWork(param) {
  return jsonPost('/dw/dailyWork/listDailyWork', param);
}

/**
 * 更新日课
 * @param dailyWork 日课内容
 */
export async function updateDailyWork(dailyWork) {
  return jsonPost('/dw/dailyWork/updateDailyWork', dailyWork);
}

/**
 * 插入日课
 * @param dailyWork 日课内容
 */
export async function insertDailyWork(dailyWork) {
  return jsonPost('/dw/dailyWork/insertDailyWork', dailyWork);
}

/**
 * 删除日课
 * @param id 日课id
 */
export async function deleteDailyWork(id?: number) {
  return jsonPost('/dw/dailyWork/deleteDailyWork', { id: id });
}

export async function markDone(id?: number, status?: string) {
  return jsonPost('/dw/dailyWork/handleDoneOrDelete', { id: id, status: status });
}

/**  ----------------- DailyWorkController end ----------------- */
