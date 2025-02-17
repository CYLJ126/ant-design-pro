import { jsonPost } from './api';

/**  ----------------- WeeklyDaysController start ----------------- */
/**
 * 返回当前周对应的表头，即周一到周天
 *
 * @param weekId 第几周
 */
export async function getWeekDateHeader(weekId?: number) {
  return jsonPost('/dw/weeklyDays/weekDateHeader', { weekId: weekId });
}

/**
 * 获取指定工作项的每周数据
 *
 * @param workId 第几周
 */
export async function getDaysData(workId?: number) {
  return jsonPost('/dw/weeklyDays/list', { workId: workId });
}

/**  ----------------- WeeklyDaysController end ----------------- */

/**  ----------------- WeeklyWorkController start ----------------- */

/**
 * 返回指定周对应的统计数据
 *
 * @param weekId 第几周
 */
export async function getWeekStatistics(weekId?: number) {
  return jsonPost('/dw/weeklyWork/statistics', { weekId: weekId });
}

/**
 * 返回指定周的事项列表
 *
 * @param weekId 第几周
 */
export async function getWorks(weekId?: number) {
  return jsonPost('/dw/weeklyWork/list', { weekId: weekId });
}

/**
 * 返回当前周的事项列表
 *
 */
export async function getCurrentWeekWorks() {
  return jsonPost('/dw/weeklyWork/listCurrent', {});
}

/**  ----------------- WeeklyWorkController end ----------------- */

/**  ----------------- StepsController start ----------------- */

/**
 * 返回目标或活动的步骤
 *
 * @param fatherId 事项 id
 */
export async function getSteps(fatherId?: number) {
  return jsonPost('/dw/steps/list', { fatherId: fatherId });
}

/**  ----------------- StepsController end ----------------- */
