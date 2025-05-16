import { useState } from 'react';

/**
 * 用于传递时刻留痕数据折叠标记
 */
export default () => {
  const [foldFlag, setFoldFlag] = useState(false);

  return {
    foldFlag,
    setFoldFlag,
  };
};
