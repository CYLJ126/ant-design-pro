import { useState } from 'react';

/**
 * 用于传递活动信息更新事件，如：
 * 1. 更新活动时，更新顶部统计信息；
 */
export default () => {
  const [updateInfo, setUpdateInfo] = useState({ id: -1 });

  return {
    updateInfo,
    setUpdateInfo,
  };
};
