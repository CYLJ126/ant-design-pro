import { useCallback, useState } from 'react';
import {
  addTarget,
  deleteBackTarget,
  getTargets,
  updateWeeklyWork,
} from '@/services/ant-design-pro/dailyWork';

export default () => {
  // 每周目标列表
  const [targets, setTargets] = useState({});

  // 初始化目标列表
  const initialTargets = useCallback(async (whichWeek) => {
    const result = await getTargets(whichWeek);
    let initialTargets = {};
    result.forEach((item) => {
      initialTargets[item.id] = {
        id: item.id,
        weekId: whichWeek,
        foldFlag: item.foldFlag,
        target: item.target, // 目标描述
        themeId: item.themeId,
        workId: item.workId,
        progress: item.progress,
        proportion: item.relations[0]?.proportion,
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
    initialTargets(whichWeek).then();
  }, []);

  // 删除目标
  const deleteTarget = useCallback(
    (targetId) => {
      const newTargets = { ...targets };
      delete newTargets[targetId];
      setTargets(newTargets);
      deleteBackTarget(targetId).then();
    },
    [targets],
  );

  // 向后端更新目标
  const updateTarget = useCallback(async (param) => {
    const newTarget = {
      id: param.id,
      themeId: param.themeId,
      workId: param.workId,
      orderId: param.orderId,
      target: param.target,
      foldFlag: param.foldFlag,
      startDate: param.startDate,
      endDate: param.endDate,
    };
    updateWeeklyWork(newTarget).then(() => {
      // 更新日期区间时，刷新列表，因为日期变化，有可能目标已不在当前周
      if (param.refreshFlag) {
        initialTargets(param.weekId);
      }
    });
  }, []);

  return {
    targets,
    initialTargets,
    addNewTarget,
    updateTarget,
    deleteTarget,
  };
};
