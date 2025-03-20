import React, { useContext, useEffect, useState } from 'react';
import { history, Outlet, useModel } from 'umi';
import { AliveScope } from 'react-activation';
import { RouteContext } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-components';
import { MenuTabProps } from '@/models/menuTags';
import IconMap from '@/icons/IconMap';

const menuMap = {
  '/HomePage': '首页',
  '/personal': '个人管理',
  '/personal/traces': '时刻留痕',
  '/personal/DailyWork': '每日计划',
  '/personal/WeeklyWork': '每周计划',
  '/personal/MonthlyWork': '每月计划',
  '/personal/QuarterlyWork': '季度规划',
  '/personal/SemiannualWork': '半年规划',
  '/personal/AnnualWork': '年度规划',
  '/personal/summary': '个人总结',
  '/personal/BadHabit': '坏习惯',
  '/tools': '工具',
  '/tools/TextFormatter': '文本格式化',
};

const initialTags = [
  {
    id: 1,
    name: '首页',
    path: '/HomePage',
    icon: IconMap['smile'],
    tab: '首页',
    key: '/HomePage',
  },
];

export default function Layout(props: any) {
  const { children, location: tempLocation } = props;
  console.log('属性children：' + JSON.stringify(children));
  console.log('属性tempLocation：' + JSON.stringify(tempLocation));
  const { location } = useContext(RouteContext);
  const { pathname } = location;
  const [activeKey, setActiveKey] = useState<string>('');
  const { menuTags, updateMenuTags } = useModel('menuTags', (model) => ({
    menuTags: model.menuTags,
    updateMenuTags: model.updateMenuTags,
  }));

  // 不需要缓存的路由
  const noCacheRoutes = ['/', '/user/login'];

  useEffect(() => {
    if (noCacheRoutes.includes(pathname)) return;
    const arr: MenuTabProps[] = menuTags.filter((item: MenuTabProps) => item.key !== pathname);
    // 不是当前打开的标签页，则新增一个
    if (arr.length === menuTags.length) {
      const activeMenu: MenuTabProps = {
        tab: menuMap[pathname] ?? 'pageTemp',
        key: pathname,
        closable: true,
      };
      arr.push(activeMenu);

      updateMenuTags(arr);
    } else if (menuTags.length === 1) {
      // 删除时，只剩一个标签，跳转到首页
      updateMenuTags([...initialTags]);
      history.push(initialTags[0].path);
    }
    setActiveKey(pathname);
  }, [location]);

  const onTabChange = (key: string) => {
    history.push(key);
    setActiveKey(key);
  };

  const onTabEdit = (key, action) => {
    console.log('key: ' + key + ', action: ' + action);
    if (action !== 'remove' || menuTags.length === 1) {
      return;
    }
    let temp = [];
    let highLight = -1;
    for (let i = 0; i < menuTags.length; i++) {
      let menu = menuTags[i];
      if (menu.key === key) {
        highLight = i;
        continue;
      }
      temp.push(menu);
    }
    if (highLight >= temp.length) {
      highLight = temp.length - 1;
    }
    if (highLight < 0) {
      highLight = 0;
    }
    updateMenuTags(temp);
    let toKey = temp[highLight].key;
    setActiveKey(toKey);
    history.push(toKey);
  };

  return (
    <PageContainer
      tabList={menuTags}
      onTabChange={onTabChange}
      header={{
        title: null,
        breadcrumb: {},
      }}
      tabProps={{
        type: 'editable-card',
        hideAdd: true,
        onEdit: onTabEdit,
        activeKey,
        tabBarStyle: {
          paddingBottom: '3px',
        },
      }}
    >
      <AliveScope>
        <Outlet />
      </AliveScope>
    </PageContainer>
  );
}
