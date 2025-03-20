import { useState, useCallback, ReactNode } from 'react';
import IconMap from '@/icons/IconMap';
import { listRecursiveMenus } from '@/services/ant-design-pro/rbac';

export interface Menu {
  id: string;
  name: string;
  path?: string;
  icon?: ReactNode;
  children?: Menu[];
}

export function transfer(rawMenu) {
  let one = {
    id: rawMenu.id,
    name: rawMenu.menuName,
    path: rawMenu.menuUrl,
    icon: IconMap[rawMenu.icon] || '',
  };
  if (rawMenu.children && rawMenu.children.length > 0) {
    one.routes = rawMenu.children.map((subRawMenu) => transfer(subRawMenu));
  }
  return one;
}

export default () => {
  const [menuPathMap, setMenuPathMap] = useState({});
  const [menuNameMap, setMenuNameMap] = useState({});

  const initialMenuMap = useCallback(() => {
    listRecursiveMenus({}).then((result) => {
      let menuPathMapTemp = {};
      let menuNameMapTemp = {};
      result?.forEach((item) => {
        const menu = transfer(item);
        menuPathMapTemp[menu.path] = menu;
        menuNameMapTemp[menu.name] = menu;
      });
      setMenuPathMap(menuPathMapTemp);
      setMenuNameMap(menuNameMapTemp);
    });
  }, []);

  const getMenuByPath = (path: string) => {
    return menuPathMap[path];
  };

  const getMenuByName = (name: string) => {
    return menuNameMap[name];
  };

  return {
    getMenuByPath,
    getMenuByName,
    initialMenuMap,
  };
};
