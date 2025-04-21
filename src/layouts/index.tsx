import React, { useContext, useEffect, useState } from 'react';
import { history, Outlet, useIntl, useModel } from 'umi';
import { AliveScope } from 'react-activation';
import { RouteContext } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-components';
import { MenuTabProps } from '@/models/menuTags';
import IconMap from '@/icons/IconMap';
import styles from './index.less';

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

/**
 * 国际化翻译，组国际化的键，然后下一步去拿到国际化信息
 *
 * @param path 页面路径
 */
function getMenuIntlInfo(path: string) {
  let pathArr = path.split('/');
  return {
    id: 'menu' + pathArr.join('.'),
    defaultMessage: pathArr.length > 0 ? pathArr[pathArr.length - 1] : 'tempPage',
  };
}

export default function Layout() {
  const { location } = useContext(RouteContext);
  const { pathname } = location;
  const [activeKey, setActiveKey] = useState<string>('');
  const { menuTags, updateMenuTags } = useModel('menuTags', (model) => ({
    menuTags: model.menuTags,
    updateMenuTags: model.updateMenuTags,
  }));
  const intl = useIntl();

  // 不需要缓存的路由
  const noCacheRoutes = ['/', '/user/login'];

  useEffect(() => {
    if (pathname === '/') {
      history.push('/HomePage');
      return;
    }
    if (noCacheRoutes.includes(pathname)) return;
    const arr: MenuTabProps[] = menuTags.filter((item: MenuTabProps) => item.key !== pathname);
    // 不是当前打开的标签页，则新增一个
    if (arr.length === menuTags.length) {
      let menuIntlInfo = getMenuIntlInfo(pathname);
      let menuName = intl.formatMessage(menuIntlInfo);
      const activeMenu: MenuTabProps = {
        tab: menuName,
        key: pathname,
        closable: true,
      };
      arr.push(activeMenu);

      // 让首页始终在第一个

      updateMenuTags(arr);
    } else if (menuTags.length === 1) {
      // 删除时，只剩一个标签，跳转到首页
      updateMenuTags([...initialTags]);
      history.push(initialTags[0].path);
    }
    setActiveKey(pathname);
    localStorage.setItem('active-key', pathname);
  }, [location]);

  const onTabChange = (key: string) => {
    history.push(key);
    setActiveKey(key);
    localStorage.setItem('active-key', key);
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

  if (noCacheRoutes.includes(location.pathname)) {
    // 不需要缓存的页面，默认为不需要 tab 标签
    return <Outlet />;
  }
  return (
    <PageContainer
      tabList={menuTags}
      onTabChange={onTabChange}
      header={{
        title: null,
        breadcrumb: {},
      }}
      className={styles.container}
      tabProps={{
        type: 'editable-card',
        hideAdd: true,
        onEdit: onTabEdit,
        activeKey,
      }}
    >
      <AliveScope>
        <Outlet />
      </AliveScope>
    </PageContainer>
  );
}
