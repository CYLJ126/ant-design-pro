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
  const [menuTags, setMenuTags] = useState<MenuItemProps[]>([]);

  // 改变缓存菜单
  const updateMenuTags = useCallback((menus: MenuItemProps[]) => {
    setMenuTags(menus);
  }, []);

  return {
    menuTags,
    updateMenuTags,
  };
};
