import { useState, useCallback } from 'react';

export interface MenuItemProps {
  name: string;
  path?: string;
  children?: MenuItemProps[];
}

export interface MenuTabProps {
  tab: string;
  pathname?: string;
  key: string;
  closable?: boolean;
}

export default () => {
  const [exitMenus, setExitMenus] = useState<MenuItemProps[]>([]);

  // 改变缓存菜单
  const updateMenus = useCallback((menus: MenuItemProps[]) => {
    setExitMenus(menus);
  }, []);

  return {
    exitMenus,
    updateMenus,
  };
};
