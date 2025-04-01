import { useCallback, useState } from 'react';

export default () => {
  // 每周统计信息控制
  const [weeklyStatistics, setWeeklyStatistics] = useState({ update: false });

  // 刷新顶部统计信息
  const refreshStatistics = useCallback(async (param) => {
    setWeeklyStatistics(param);
  }, []);

  return {
    weeklyStatistics,
    refreshStatistics,
  };
};
