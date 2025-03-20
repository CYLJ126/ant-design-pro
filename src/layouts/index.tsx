import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useModel, history } from 'umi';
import { AliveScope } from 'react-activation';
import { RouteContext } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-components';
import { MenuTabProps } from '@/models/menuTags';

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
  const { getMenuByPath } = useModel('menuMap');

  // 不需要缓存的路由
  const noCacheRoutes = ['/', '/user/login'];

  useEffect(() => {
    if (noCacheRoutes.includes(pathname)) return;
    const arr: MenuTabProps[] = menuTags.filter((item: MenuTabProps) => item.key !== pathname);
    if (arr.length === menuTags.length) {
      const activeMenu: MenuTabProps = {
        tab: getMenuByPath(pathname).name,
        key: pathname,
        closable: menuTags.length > 0, // 新增时，第一个页面不能删除
      };
      arr.push(activeMenu);

      updateMenuTags(arr);
    } else if (menuTags.length === 1) {
      // 删除时,只剩一个标签去掉删除图标
      const data = menuTags;
      data[0].closable = false;
      updateMenuTags(data);
    }
    setActiveKey(pathname);
  }, [location]);

  const onTabChange = (key: string) => {
    history.push(key);
    setActiveKey(key);
  };

  return (
    <PageContainer
      tabList={menuTags}
      onTabChange={onTabChange}
      header={{
        title: null,
      }}
      tabProps={{
        type: 'editable-card',
        hideAdd: true,
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
