import { useState } from 'react';

/**
 * 用于传递目标信息更新事件，如：
 * 1. 在更新每日进度数据时，更新顶部统计信息和当前目标分数；
 * 2. 更新目标占比时，更新顶部统计信息；
 */
export default () => {
  const [updateInfo, setUpdateInfo] = useState({});

  return {
    updateInfo,
    setUpdateInfo,
  };
};
