import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getTags } from '@/services/ant-design-pro/base';

const TimeTraceContext = createContext({});

export function TimeTraceProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [themeOptions, setThemeOptions] = useState([]);

  useEffect(() => {
    // 加载主题下拉
    getTags({ name: '时刻留痕' }).then((rootTag) => {
      getTags({ fatherId: rootTag[0].id, status: 'DOING' }).then((result) => {
        const temp = result.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setThemeOptions(temp);
      });
    });
  }, []);

  // 获取子级标签
  const getSubTags = async (fatherId) => {
    const result = await getTags({ fatherId: fatherId, status: 'DOING' });
    return result.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  };

  // 封装修改日期的方法
  const updateDate = (newDate) => {
    setCurrentDate(dayjs(newDate));
  };

  // 提供日期和修改方法给子组件
  const value = {
    getSubTags,
    themeOptions,
    currentDate,
    updateDate,
  };

  return <TimeTraceContext.Provider value={value}>{children}</TimeTraceContext.Provider>;
}

// 自定义 hook 方便使用
export function useTimeTraceData() {
  const context = useContext(TimeTraceContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}
