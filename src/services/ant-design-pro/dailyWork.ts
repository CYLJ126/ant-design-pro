import {jsonPost, jsonPostList} from './api';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';

/**  ----------------- WeeklyDaysController start ----------------- */
/**
 * 返回周下拉列表
 *
 * @param time 时间
 * @param offset 偏移量
 */
export async function getWeekInfoList(time: any, offset: any) {
  return jsonPost('/dw/weeklyDays/getWeekInfoList', {time: time, offset: offset});
}

/**
 * #返回当前周对应的表头，即周一到周天
 *
 * @param weekId 第几周
 */
export async function getWeekDaysHeader(weekId?: number) {
  return jsonPost('/dw/weeklyDays/listWeekDaysHeader', {weekId: weekId});
}

/**
 * #获取指定目标的每周进度数据
 *
 * @param targetId 指定事项 ID
 * @param weekId 指定周 ID
 */
export async function listWeekDays(targetId?: number, weekId?: number) {
  return jsonPost('/dw/weeklyDays/listWeekDays', {targetId: targetId, weekId: weekId});
}

/**
 * 更新对应天数的进度数据
 *
 * @param dayData 对应天数的进度数据
 */
export async function updateDayData(dayData: any) {
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
  return jsonPost('/dw/weeklyWork/getWeekStatistics', {weekId: weekId});
}

/**
 * 更新指定周对应的统计数据
 *
 * @param weekId 第几周
 */
export async function updateWeeklyStatistics(weekId?: number) {
  return jsonPost('/dw/weeklyWork/updateWeeklyStatistics', {weekId: weekId});
}

/**
 * 根据 ID 获取目标
 *
 * @param targetId 目标 ID
 */
export async function getTarget(targetId?: number) {
  return jsonPost('/dw/weeklyWork/getTarget', {targetId: targetId});
}

/**
 * 返回指定周的目标列表
 *
 * @param param 请求参数
 */
export async function listTargets(param: any) {
  return jsonPostList('/dw/weeklyWork/listTargets', param);
}

/**
 * 返回指定周的目标列表，用于日课下拉查询
 *
 * @param data 请求参数
 */
export async function getTargetsForDaily(data: any) {
  return jsonPostList('/dw/weeklyWork/listTargets', data);
}

/**
 * #添加新目标，并返回
 */
export async function addTarget(weekId?: number) {
  return jsonPost('/dw/weeklyWork/addTarget', {weekId: weekId});
}

/**
 * 复制目标
 */
export async function copyTarget(targetId?: number) {
  return jsonPost('/dw/weeklyWork/copyTarget', {targetId: targetId});
}

/**
 * #删除指定目标
 */
export async function deleteBackTarget(targetId?: number) {
  return jsonPost('/dw/weeklyWork/deleteTarget', {id: targetId});
}

/**
 * #返回当前周的目标列表
 *
 */
export async function getCurrentWeekTargets() {
  return jsonPostList('/dw/weeklyWork/listCurrentTargets', {});
}

/**
 * 更新当前目标信息
 *
 */
export async function updateWeeklyWork(headInfo: any) {
  return jsonPost('/dw/weeklyWork/updateWeeklyWork', headInfo);
}

/**
 * 更新当前目标信息在本周的占比
 *
 * @param param 请求参数
 */
export async function updateWeeklyWorkProportion(param: any) {
  return jsonPost('/dw/weeklyWork/updateWeeklyWorkProportion', {
    mainId: param.id,
    subjectId: param.weekId,
    proportion: param.proportion,
  });
}

/**
 * 根据周 ID 获取指定周所有活动，并按主题或事项进行汇总、格式化，加总工时，返回总结内容
 *
 * @param weekId 请求参数
 */
export async function summaryForWeek(weekId?: number) {
  return jsonPost('/dw/weeklyWork/summaryForWeek', {weekId: weekId});
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
  return jsonPostList('/dw/steps/listSteps', {targetId: targetId, type: type});
}

/**
 * 更新整体步骤
 *
 * @param steps 步骤列表
 */
export async function saveSteps(steps: any) {
  return jsonPostList('/dw/steps/saveSteps', steps);
}

/**
 * 更新步骤
 * @param step 步骤
 */
export async function updateStep(step: any) {
  return jsonPost('/dw/steps/updateStep', step);
}

/**
 * 更新步骤状态
 * 因为操作上可能修改了步骤内容，还没离焦直接点了完成，导致更新状态时用原来的步骤内容更新，修改后的内容没了
 * @param step 步骤
 */
export async function switchStepStatus(step: any) {
  return jsonPost('/dw/steps/switchStepStatus', step);
}

/**  ----------------- StepsController end ----------------- */

/**  ----------------- DailyWorkController start ----------------- */

/**
 * 日课列表
 * @param param 请求参数
 */
export async function listDailyWork(param: any) {
  return jsonPostList('/dw/dailyWork/listDailyWork', param);
}

/**
 * 日课页面使用
 * @param param 请求参数
 */
export async function listDailyWorkByDay(param: any) {
  return jsonPostList('/dw/dailyWork/listDailyWorkByDay', param);
}

/**
 * 通过 ID 查询日课
 * @param param 请求参数
 */
export async function getDailyWorkById(param: any) {
  return jsonPost('/dw/dailyWork/getDailyWorkById', param);
}

/**
 * 更新日课
 * @param dailyWork 日课内容
 */
export async function updateDailyWork(dailyWork: any) {
  return jsonPost('/dw/dailyWork/updateDailyWork', dailyWork);
}

/**
 * 插入日课
 * @param dailyWork 日课内容
 */
export async function addDailyWorkBack(dailyWork: any) {
  return jsonPost('/dw/dailyWork/addDailyWork', dailyWork);
}

/**
 * 删除日课
 * @param id 日课id
 */
export async function deleteDailyWork(id?: number) {
  return jsonPost('/dw/dailyWork/deleteDailyWork', {id: id});
}

/**
 * 标记为完成或待办
 *
 * @param param 请求参数
 */
export async function markDoneBack(param: any) {
  return jsonPost('/dw/dailyWork/switchDailyWorkStatus', param);
}

/**
 * 展开或折叠活动
 *
 * @param id 要处理的活动 ID
 * @param status 折叠状态 0-折叠；1-展开；
 */
export async function foldActivity(id?: number, status?: number) {
  return jsonPost('/dw/dailyWork/foldActivity', {id: id, foldFlag: status});
}

/**
 * 将指定的本周常规事项添加为当日的活动
 *
 * @param tagId 标签 ID
 * @param weekId 周 ID
 * @param weekDay 周几（0 表示周一）
 */
export async function addFromRegularActivity(tagId?: number, weekId?: number, weekDay?: any) {
  return jsonPost('/dw/dailyWork/addFromRegularActivity', {
    tagId: tagId,
    weekId: weekId,
    weekDay: weekDay,
  });
}

/**
 * 点击按钮，为当前目标添加当日活动
 *
 * @param weekId 周 ID
 * @param workId 事项 ID
 * @param targetId 目标 ID
 */
export async function addActivityFromWeeklyWork(
  weekId?: number,
  workId?: number,
  targetId?: number,
) {
  return jsonPost('/dw/dailyWork/addActivityFromWeeklyWork', {
    weekId: weekId,
    workId: workId,
    id: targetId,
  });
}

/**
 * 生成当日总结格式
 *
 * @param param 指定日期范围
 * @return 总结内容
 */
export async function summaryForToday(param: any) {
  return jsonPost('/dw/dailyWork/summaryForToday', param);
}

/**
 * 提取并加总多行文本内容中的时间
 *
 * @param param 对应的活动参数
 * @return 总结内容
 */
export async function extractCostTime(param: any) {
  return jsonPost('/dw/dailyWork/extractCostTime', param);
}

/**  ----------------- DailyWorkController end ----------------- */

/**  ----------------- TodoWorkController start ----------------- */
/**
 * 查询待办任务
 * @param param 请求参数
 */
export async function listTodoWork(param: any) {
  return jsonPostList('/dw/todoWork/listTodoWork', param);
}

/**
 * 插入待办任务
 * @param param 请求参数
 */
export async function addTodoWork(param: any) {
  return jsonPost('/dw/todoWork/addTodoWork', param);
}

/**
 * 更新待办任务
 * @param param 请求参数
 */
export async function updateTodoWork(param: any) {
  return jsonPost('/dw/todoWork/updateTodoWork', param);
}

/**
 * 删除待办任务
 * @param id 请求参数 ID
 */
export async function deleteTodoWork(id?: number) {
  return jsonPost('/dw/todoWork/deleteTodoWork', {id: id});
}

/**  ----------------- TodoWorkController end ----------------- */

/**  ----------------- TimeTraceController start ----------------- */

/**
 * 显示昨天的数据还是今天的，后端返回一个日期
 */
export async function showTodayOrYesterday() {
  return jsonPost('/dw/timeTrace/showTodayOrYesterday', {});
}

/**
 * 查询时刻留痕数据
 * @param param 请求参数
 */
export async function listTraces(param: any) {
  return jsonPost('/dw/timeTrace/listTraces', param);
}

/**
 * 新增时刻留痕记录
 * @param param 请求参数
 */
export async function addTrace(param: any) {
  return jsonPost('/dw/timeTrace/addTrace', param);
}

/**
 * 更新时刻留痕记录
 * @param param 请求参数
 */
export async function updateTrace(param: any) {
  return jsonPost('/dw/timeTrace/updateTrace', param);
}

/**
 * 删除时刻留痕记录
 * @param param 请求参数
 */
export async function deleteTrace(param: any) {
  return jsonPost('/dw/timeTrace/deleteTrace', param);
}

/**
 * 更新留痕数据指定日期的记录
 * @param param 请求参数
 */
export async function markDay(param: any) {
  return jsonPost('/dw/timeTrace/markDay', param);
}

/**  ----------------- TimeTraceController end ----------------- */

/**  ----------------- StickyController start ----------------- */

/**
 * 根据条件查询便笺 ID 列表
 * @param param 请求参数
 */
export async function listStickies(param: any) {
  return jsonPostList('/dw/sticky/listStickies', param);
}

/**
 * 获取便笺详情
 * @param id 请求参数
 */
export async function getStickyById(id?: number) {
  return jsonPost('/dw/sticky/getStickyById', {id: id});
}

/**
 * 添加便笺
 * @param param 请求参数
 */
export async function addSticky(param: any) {
  return jsonPost('/dw/sticky/addSticky', param);
}

/**
 * 更新便笺标题、 内容
 * @param param 请求参数
 */
export async function updateSticky(param: any) {
  return jsonPost('/dw/sticky/updateSticky', param);
}

/**
 * 更新便笺宽度、高度
 * @param param 请求参数
 */
export async function resizeSticky(param: any) {
  return jsonPost('/dw/sticky/resizeSticky', param);
}

/**
 * 排序便笺
 * @param param 请求参数
 */
export async function orderSticky(param: any) {
  return jsonPost('/dw/sticky/orderSticky', param);
}

/**
 * 折叠或展开便笺
 * deprecated：页面自动控制高度，无需后端控制
 * @param param 请求参数
 */
export async function foldSticky(param: any) {
  return jsonPost('/dw/sticky/foldSticky', param);
}

/**
 * 更新主题色
 * @param param 请求参数
 */
export async function switchThemeColor(param: any) {
  return jsonPost('/dw/sticky/switchThemeColor', param);
}

/**
 * 逻辑删除
 * @param param 请求参数
 */
export async function deleteSticky(param: any) {
  return jsonPost('/dw/sticky/deleteSticky', param);
}

/**  ----------------- StickyController end ----------------- */

/**  ----------------- WeeklyRegularActivityController start ----------------- */
/**
 * 添加每周常规活动
 * @param param 待添加的每周常规活动
 */
export async function addWeeklyRegularActivity(param: any) {
  return jsonPost('/dw/weeklyRegularActivity/addWeeklyRegularActivity', param);
}

/**
 * 更新每周常规活动
 * @param id 待更新的每周常规活动 ID
 * @param checked 已选择的天数列表
 */
export async function updateWeeklyRegularActivity(id?: number, checked?: any) {
  return jsonPost('/dw/weeklyRegularActivity/updateWeeklyRegularActivity', {
    id: id,
    checked: checked,
  });
}

/**
 * 删除每周常规活动
 * @param id 待删除的每周常规活动 ID
 */
export async function deleteWeeklyRegularActivity(id?: number) {
  return jsonPost('/dw/weeklyRegularActivity/deleteWeeklyRegularActivity', {id: id});
}

/**
 * 查询对应周的常规活动
 * @param weekId 周 ID
 */
export async function listWeeklyRegularActivities(weekId?: number) {
  return jsonPostList('/dw/weeklyRegularActivity/listWeeklyRegularActivities', {weekId: weekId});
}

/**
 * 常规活动数据更新时，更新周统计
 * @param weekId 周 ID
 * @param proportion 常规活动占比
 * @param score 常规活动得分
 */
export async function updateWeeklyStatisticsForRegularActivities(
  weekId?: number,
  proportion?: number,
  score?: number,
) {
  return jsonPost('/dw/weeklyRegularActivity/updateWeeklyStatisticsForRegularActivities', {
    aimId: weekId,
    proportion: proportion,
    score: score,
  });
}

/**  ----------------- WeeklyRegularActivityController end ----------------- */
