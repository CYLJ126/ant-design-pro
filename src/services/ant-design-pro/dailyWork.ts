import { jsonPost, jsonPostList } from './api';
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
 * 更新指定周对应的统计数据
 *
 * @param weekId 第几周
 */
export async function updateWeeklyStatistics(weekId?: number) {
  return jsonPost('/dw/weeklyWork/updateWeeklyStatistics', { weekId: weekId });
}

/**
 * 根据 ID 获取目标
 *
 * @param targetId 目标 ID
 */
export async function getTarget(targetId) {
  return jsonPost('/dw/weeklyWork/getTarget', { targetId: targetId });
}

/**
 * 返回指定周的目标列表
 *
 * @param whichWeek 对应周 ID
 */
export async function getTargets(whichWeek) {
  return jsonPost('/dw/weeklyWork/listTargets', { weekId: whichWeek });
}

/**
 * 返回指定周的目标列表，用于日课下拉查询
 *
 * @param data 请求参数
 */
export async function getTargetsForDaily(data) {
  return jsonPost('/dw/weeklyWork/listTargets', data);
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
export async function deleteBackTarget(targetId) {
  return jsonPost('/dw/weeklyWork/deleteTarget', { id: targetId });
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

/**
 * 更新当前目标信息在本周的占比
 *
 * @param param 请求参数
 */
export async function updateWeeklyWorkProportion(param) {
  return jsonPost('/dw/weeklyWork/updateWeeklyWorkProportion', {
    mainId: param.id,
    subjectId: param.weekId,
    proportion: param.proportion,
  });
}

/**  ----------------- WeeklyWorkController end ----------------- */

/**  ----------------- StepsController start ----------------- */

/**
 * 返回目标的步骤
 *
 * @param targetId 事项 id
 * @param type 类型：daily、weekly、monthly、quarterly、semiannual、annual……见 DwStatisticsEnum 枚举
 */
export async function getSteps(
  targetId?: number,
  type?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual',
) {
  return jsonPostList('/dw/steps/listSteps', { targetId: targetId, type: type });
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
 * 通过 ID 查询日课
 * @param param 请求参数
 */
export async function getDailyWorkById(param) {
  return jsonPost('/dw/dailyWork/getDailyWorkById', param);
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
export async function addDailyWorkBack(dailyWork) {
  return jsonPost('/dw/dailyWork/addDailyWork', dailyWork);
}

/**
 * 删除日课
 * @param id 日课id
 */
export async function deleteDailyWork(id?: number) {
  return jsonPost('/dw/dailyWork/deleteDailyWork', { id: id });
}

/**
 * 标记为完成或待办
 *
 * @param id 要处理的活动 ID
 * @param status INITIAL-待办；DONE-完成；
 */
export async function markDoneBack(id?: number, status?: string) {
  return jsonPost('/dw/dailyWork/switchDailyWorkStatus', { id: id, status: status });
}

/**
 * 展开或折叠活动
 *
 * @param id 要处理的活动 ID
 * @param status 折叠状态 0-折叠；1-展开；
 */
export async function foldActivity(id?: number, status?: number) {
  return jsonPost('/dw/dailyWork/foldActivity', { id: id, foldFlag: status });
}

/**  ----------------- DailyWorkController end ----------------- */

/**  ----------------- TodoWorkController start ----------------- */
/**
 * 查询待办任务
 * @param param 请求参数
 */
export async function listTodoWork(param) {
  return jsonPost('/dw/todoWork/listTodoWork', param);
}

/**
 * 插入待办任务
 * @param param 请求参数
 */
export async function addTodoWork(param) {
  return jsonPost('/dw/todoWork/addTodoWork', param);
}

/**
 * 更新待办任务
 * @param param 请求参数
 */
export async function updateTodoWork(param) {
  return jsonPost('/dw/todoWork/updateTodoWork', param);
}

/**
 * 删除待办任务
 * @param id 请求参数 ID
 */
export async function deleteTodoWork(id?: number) {
  return jsonPost('/dw/todoWork/deleteTodoWork', { id: id });
}

/**  ----------------- TodoWorkController end ----------------- */

/**  ----------------- TimeTraceController start ----------------- */

/**
 * 查询时刻留痕数据
 * @param param 请求参数
 */
export async function listTraces(param) {
  return jsonPost('/dw/timeTrace/listTraces', param);
}

/**
 * 新增时刻留痕记录
 * @param param 请求参数
 */
export async function addTrace(param) {
  return jsonPost('/dw/timeTrace/addTrace', param);
}

/**
 * 更新时刻留痕记录
 * @param param 请求参数
 */
export async function updateTrace(param) {
  return jsonPost('/dw/timeTrace/updateTrace', param);
}

/**
 * 删除时刻留痕记录
 * @param param 请求参数
 */
export async function deleteTrace(param) {
  return jsonPost('/dw/timeTrace/deleteTrace', param);
}

/**
 * 更新留痕数据指定日期的记录
 * @param param 请求参数
 */
export async function markDay(param) {
  return jsonPost('/dw/timeTrace/markDay', param);
}

/**  ----------------- TimeTraceController end ----------------- */

/**  ----------------- StickyController start ----------------- */

/**
 * 根据条件查询便笺 ID 列表
 * @param param 请求参数
 */
export async function listStickies(param) {
  return jsonPostList('/dw/sticky/listStickies', param);
}

/**
 * 获取便笺详情
 * @param id 请求参数
 */
export async function getStickyById(id) {
  return jsonPost('/dw/sticky/getStickyById', { id: id });
}

/**
 * 添加便笺
 * @param param 请求参数
 */
export async function addSticky(param) {
  return jsonPost('/dw/sticky/addSticky', param);
}

/**
 * 更新便笺标题、 内容
 * @param param 请求参数
 */
export async function updateSticky(param) {
  return jsonPost('/dw/sticky/updateSticky', param);
}

/**
 * 更新便笺宽度、高度
 * @param param 请求参数
 */
export async function resizeSticky(param) {
  return jsonPost('/dw/sticky/resizeSticky', param);
}

/**
 * 排序便笺
 * @param param 请求参数
 */
export async function orderSticky(param) {
  return jsonPost('/dw/sticky/orderSticky', param);
}

/**
 * 折叠或展开便笺
 * @param param 请求参数
 */
export async function foldSticky(param) {
  return jsonPost('/dw/sticky/foldSticky', param);
}

/**
 * 更新便笺标签 ID 列表
 * @param param 请求参数
 */
export async function updateStickyTag(param) {
  return jsonPost('/dw/sticky/updateStickyTag', param);
}

/**  ----------------- StickyController end ----------------- */
