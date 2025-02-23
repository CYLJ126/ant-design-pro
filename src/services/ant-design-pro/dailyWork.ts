import { jsonPost } from './api';

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
 */
export async function getDaysData(targetId?: number) {
  return jsonPost('/dw/weeklyDays/listWeekDays', { targetId: targetId });
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
 * @param weekId 第几周
 */
export async function getTargets(weekId?: number) {
  return jsonPost('/dw/weeklyWork/listTargets', { weekId: weekId });
}

/**
 * #添加新目标，并返回
 */
export async function addTarget() {
  return jsonPost('/dw/weeklyWork/addTarget', {});
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
