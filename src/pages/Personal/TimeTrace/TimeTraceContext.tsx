import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { getTags } from '@/services/ant-design-pro/base';
import { deleteTrace, listTraces } from '@/services/ant-design-pro/dailyWork';
import { message } from 'antd';

const TimeTraceContext = createContext({});

export function TimeTraceProvider({ children }) {
  const currentDate = useRef(dayjs());
  const [themeOptions, setThemeOptions] = useState([]);
  const [timeTraces, setTimeTraces] = useState([]);
  const headParam = useRef({});

  // 获取子级标签
  const getSubTags = useCallback(async (fatherId) => {
    const result = await getTags({ fatherId: fatherId, status: 'DOING' });
    return result.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  }, []);

  // 封装修改日期的方法
  const updateDate = useCallback((newDate) => {
    currentDate.current = dayjs(newDate);
  }, []);

  // 刷新数据
  const fetchTraces = useCallback((param) => {
    headParam.current = param;
    listTraces(param).then((result) => {
      setTimeTraces(result);
    });
  }, []);

  // 删除数据
  const deleteOne = useCallback(
    (id) => {
      deleteTrace({ id: id }).then((result) => {
        fetchTraces(headParam.current);
        if (result) {
          message.success('删除成功').then();
        } else {
          message.error('删除失败').then();
        }
      });
    },
    [fetchTraces],
  );

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
    // 初始化时加载留痕数据
    fetchTraces({ currentDate: currentDate.current.format('YYYY-MM-DD') });
  }, []);

  // 提供日期和修改方法给子组件
  const value = useMemo(() => {
    return {
      timeTraces,
      fetchTraces,
      getSubTags,
      themeOptions,
      currentDate,
      updateDate,
      deleteOne,
    };
  }, [timeTraces, fetchTraces, getSubTags, themeOptions, currentDate, updateDate, deleteOne]);

  return <TimeTraceContext.Provider value={value}>{children}</TimeTraceContext.Provider>;
}

// 自定义 hook 方便使用
export function useTimeTraceData() {
  const context = useContext(TimeTraceContext);
  if (!context) {
    throw new Error('useTimeTraceData must be used within a DataProvider');
  }
  return context;
}
