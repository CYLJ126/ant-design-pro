import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addSticky, listStickies } from '@/services/ant-design-pro/dailyWork';

const StickyNoteContext = createContext({});

export function StickyNoteProvider({ children }) {
  const [whichDay, setWhichDay] = useState(new Date());
  const [queryParam, setQueryParam] = useState({});
  const [stickies, setStickies] = useState([]);

  const list = useCallback(
    async (param) => {
      listStickies({ ...queryParam, ...param }).then((res) => {
        setStickies(res.rows);
      });
    },
    [queryParam],
  );

  const addBlankOne = useCallback(async () => {
    const stickyNote = {
      title: '标题',
      content: '内容',
      width: 300,
      height: 200,
      x: 0,
      y: 0,
    };
    await addSticky(stickyNote);
    list().then();
  }, [list]);

  const value = useMemo(
    () => ({
      queryParam,
      setQueryParam,
      stickies,
      list,
      addBlankOne,
      whichDay,
      setWhichDay,
    }),
    [queryParam, stickies, addBlankOne, list, whichDay],
  );

  useEffect(() => {
    const today = new Date();
    setWhichDay(today);
    list({ endDate: today }).then();
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
