import IconMap from '@/icons/IconMap';
import { ReactNode } from 'react';
import { listRecursiveMenus } from '@/services/ant-design-pro/rbac';

interface Menu {
  id: string;
  name: string;
  path?: string;
  icon?: ReactNode;
  children?: Menu[];
}

let menus = await listRecursiveMenus({ status: 1 });
let menuPathMap = {};

function transfer(rawMenu) {
  let one = {
    id: rawMenu.id,
    name: rawMenu.menuName,
    path: rawMenu.menuUrl,
    icon: IconMap[rawMenu.icon] || '',
  };
  menuPathMap[one.path] = one;
  if (rawMenu.children && rawMenu.children.length > 0) {
    one.routes = rawMenu.children.map((subRawMenu) => transfer(subRawMenu));
  }
  return one;
}

async function getMenus() {
  if (!menus) {
    const result = await listRecursiveMenus({ status: 1 });
    menuPathMap = {};
    menus = result.map((menu) => transfer(menu));
  }
  return menus;
}

function getMenuByPath(path: string) {
  return menuPathMap[path];
}

export { Menu, getMenus, getMenuByPath };
