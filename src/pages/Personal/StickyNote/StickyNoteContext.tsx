import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addSticky, listStickyIds } from '@/services/ant-design-pro/dailyWork';

const StickyNoteContext = createContext({});

export function StickyNoteProvider({ children }) {
  const [queryParam, setQueryParam] = useState({});
  const [ids, setIds] = useState([]);

  const listIds = useCallback(async () => {
    listStickyIds(queryParam).then((res) => {
      setIds(res.rows);
    });
  }, [queryParam]);

  const addBlankOne = useCallback(async () => {
    const stickyNote = {
      title: '标题',
      content: '内容',
      width: 300,
      height: 200,
      x: 0,
      y: 0,
    };
    const result = await addSticky(stickyNote);
    setIds([result.id, ...ids]);
  }, [ids]);

  const value = useMemo(
    () => ({
      queryParam,
      setQueryParam,
      ids,
      listIds,
      addBlankOne,
    }),
    [queryParam, ids, addBlankOne, listIds],
  );

  useEffect(() => {
    listIds().then();
  }, [queryParam]);

  return <StickyNoteContext.Provider value={value}>{children}</StickyNoteContext.Provider>;
}

// 自定义 hook 方便使用
export function useStickyNoteData() {
  const context = useContext(StickyNoteContext);
  if (!context) {
    throw new Error('useStickyNoteData must be used within a DataProvider');
  }
  return context;
}
