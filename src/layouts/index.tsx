import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useModel, history } from 'umi';
import { AliveScope } from 'react-activation';
import { RouteContext } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-components';
import { MenuTabProps } from '@/models/exitMenus';

export default function Layout(props: any) {
  console.log('属性：' + JSON.stringify(props));
  const { location } = useContext(RouteContext);
  const { pathname } = location;
  const [activeKey, setActiveKey] = useState<string>('');
  const { exitMenus, updateMenus } = useModel('exitMenus', (model) => ({
    exitMenus: model.exitMenus,
    updateMenus: model.updateMenus,
  }));

  // 不需要缓存的路由
  const noCacheRoutes = ['/', '/user/login'];

  useEffect(() => {
    if (noCacheRoutes.includes(pathname)) return;
    const arr: MenuTabProps[] = exitMenus.filter((item: MenuTabProps) => item.key !== pathname);
    if (arr.length === exitMenus.length) {
      const activeMenu: MenuTabProps = {
        tab: '新增',
        key: pathname,
        closable: exitMenus.length > 0, // 新增时，第一个页面不能删除
      };
      arr.push(activeMenu);

      updateMenus(arr);
    } else if (exitMenus.length === 1) {
      // 删除时,只剩一个标签去掉删除图标
      const data = exitMenus;
      data[0].closable = false;
      updateMenus(data);
    }
    setActiveKey(pathname);
  }, [location]);

  const onTabChange = (key: string) => {
    history.push(key);
    setActiveKey(key);
  };

  return (
    <PageContainer
      tabList={exitMenus}
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
