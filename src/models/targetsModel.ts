import { useCallback, useState } from 'react';
import {
  addTarget,
  deleteBackTarget,
  getTargets,
  updateWeeklyWork,
} from '@/services/ant-design-pro/dailyWork';

export default () => {
  // 每周目标列表
  const [targets, setTargets] = useState([]);
  // 每周统计信息控制
  const [weeklyStatistics, setWeeklyStatistics] = useState({ update: false });

  // 初始化目标列表
  const initialTargets = useCallback(async (whichWeek) => {
    const result = await getTargets(whichWeek);
    const initialTargets = result.map((item) => {
      return {
        id: item.id,
        target: item.target, // 目标描述
        themeId: item.themeId,
        workId: item.workId,
        foldFlag: item.foldFlag,
        progress: item.progress,
        proportion: item.proportion,
        score: item.score,
        startDate: item.startDate,
        endDate: item.endDate,
      };
    });
    setTargets(initialTargets);
  }, []);

  // 添加新目标
  const addNewTarget = useCallback(async (whichWeek) => {
    await addTarget(whichWeek);
    await initialTargets(whichWeek);
  }, []);

  // 删除目标
  const deleteTarget = useCallback((targetId) => {
    const newTargets = targets.filter((item) => item.id !== targetId);
    setTargets(newTargets);
    deleteBackTarget(targetId).then();
  }, []);

  // 向后端更新目标
  const updateTarget = useCallback(async (param) => {
    const newTarget = {
      id: param.id,
      themeId: param.themeId,
      workId: param.workId,
      orderId: param.orderId,
      target: param.target,
      foldFlag: param.foldFlag,
      proportion: param.proportion,
      startDate: param.startDate,
      endDate: param.endDate,
    };
    await updateWeeklyWork(newTarget);
  }, []);

  // 获取对应目标
  const getTargetById = (targetId) => {
    for (const element of targets) {
      if (element.id === targetId) {
        return element;
      }
    }
    return null;
  };

  return {
    targets,
    initialTargets,
    setTargets,
    getTargetById,
    addNewTarget,
    updateTarget,
    deleteTarget,
    weeklyStatistics,
    setWeeklyStatistics,
  };
};
