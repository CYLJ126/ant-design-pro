import { CloseOutlined } from '@ant-design/icons';
import { history, useIntl, useLocation } from '@umijs/max';
import { Button, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { useAliveController } from 'react-activation';

const useStyles = createStyles(({ token }) => ({
  tabsContainer: {
    backgroundColor: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorder}`,
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  customTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabContent: {
    flex: 1,
  },
  closeButton: {
    fontSize: '12px',
    color: token.colorTextTertiary,
    '&:hover': {
      color: token.colorTextSecondary,
      backgroundColor: token.colorFillTertiary,
    },
  },
}));

export interface TabItem {
  key: string;
  label: string;
  pathname: string;
  search?: string;
  closable?: boolean;
}

/**
 * 国际化翻译，组国际化的键，然后下一步去拿到国际化信息
 *
 * @param path 页面路径
 */
function getMenuIntlInfo(path: string) {
  const pathArr = path.split('/');
  return {
    id: 'menu' + pathArr.join('.'),
    defaultMessage:
      pathArr.length > 0 ? pathArr[pathArr.length - 1] : 'tempPage',
  };
}

const TabsLayout: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const { drop, refresh, getCachingNodes } = useAliveController();
  const [activeKey, setActiveKey] = useState<string>('');
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const intl = useIntl();

  // 根据路径生成标签页信息
  const generateTabInfo = (pathname: string, search?: string): TabItem => {
    const key = `${pathname}${search || ''}`;
    const menuIntlInfo = getMenuIntlInfo(pathname);
    let label = intl.formatMessage(menuIntlInfo) || 'tempPage';
    // 如果有查询参数，可以在这里处理标签显示
    if (search) {
      const params = new URLSearchParams(search);
      const id = params.get('id');
      if (id) {
        label += ` (${id})`;
      }
    }
    return {
      key,
      label,
      pathname,
      search,
      closable: pathname !== '/HomePage', // 首页不可关闭
    };
  };

  // 监听路由变化，添加或激活标签页
  useEffect(() => {
    const { pathname, search } = location;
    const nodes = getCachingNodes();
    console.log(
      '当前缓存的页面:',
      nodes.map((n) => n.name),
    );
    console.log('缓存节点数量:', nodes.length);
    nodes.forEach((node) => {
      console.log('缓存节点详情:', node.name, node);
    });
    // 忽略登录页等不需要标签的页面
    if (pathname.startsWith('/user/') || pathname === '/') {
      return;
    }
    const tabInfo = generateTabInfo(pathname, search);
    setTabs((prevTabs) => {
      const existingTab = prevTabs.find((tab) => tab.key === tabInfo.key);
      if (existingTab) {
        return prevTabs;
      }
      return [...prevTabs, tabInfo];
    });
    setActiveKey(tabInfo.key);
  }, [location.pathname, location.search]);

  // 标签页切换
  const handleTabChange = (key: string) => {
    const tab = tabs.find((t) => t.key === key);
    if (tab) {
      setActiveKey(key);
      history.push({
        pathname: tab.pathname,
        search: tab.search,
      });
    }
  };

  // 关闭标签页
  const handleTabClose = (key: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const tab = tabs.find((t) => t.key === key);
    if (!tab || !tab.closable) return;
    const newTabs = tabs.filter((t) => t.key !== key);
    setTabs(newTabs);
    // 删除缓存
    drop(key).then();
    // 如果关闭的是当前激活的标签页，需要跳转到其他页面
    if (activeKey === key) {
      const nextTab = newTabs[newTabs.length - 1] || newTabs[0];
      if (nextTab) {
        setActiveKey(nextTab.key);
        history.push({
          pathname: nextTab.pathname,
          search: nextTab.search,
        });
      } else {
        // 如果没有其他标签页，跳转到首页
        history.push('/HomePage');
      }
    }
  };

  // 关闭其他标签页
  const handleCloseOthers = (currentKey: string) => {
    const currentTab = tabs.find((t) => t.key === currentKey);
    if (!currentTab) return;
    const newTabs = tabs.filter((t) => t.key === currentKey || !t.closable);
    // 删除其他标签页的缓存
    tabs.forEach((tab) => {
      if (tab.key !== currentKey && tab.closable) {
        drop(tab.key).then();
      }
    });
    setTabs(newTabs);
    setActiveKey(currentKey);
  };

  // 关闭所有可关闭的标签页
  const handleCloseAll = () => {
    const newTabs = tabs.filter((t) => !t.closable);
    // 删除所有可关闭标签页的缓存
    tabs.forEach((tab) => {
      if (tab.closable) {
        drop(tab.key).then();
      }
    });
    setTabs(newTabs);
    // 跳转到首页或第一个不可关闭的标签页
    const firstTab = newTabs[0];
    if (firstTab) {
      setActiveKey(firstTab.key);
      history.push({
        pathname: firstTab.pathname,
        search: firstTab.search,
      });
    } else {
      history.push('/HomePage');
    }
  };

  const renderTabLabel = (tab: TabItem) => (
    <div className={styles.customTab}>
      <span className={styles.tabContent}>{tab.label}</span>
      {tab.closable && (
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          className={styles.closeButton}
          onClick={(e) => handleTabClose(tab.key, e)}
        />
      )}
    </div>
  );

  const items = tabs.map((tab) => ({
    key: tab.key,
    label: renderTabLabel(tab),
    closable: false, // 我们自己处理关闭逻辑
  }));

  // 如果在登录页面或没有标签，不显示标签栏
  if (tabs.length === 0 || location.pathname.startsWith('/user/')) {
    return null;
  }

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        items={items}
        onChange={handleTabChange}
        tabBarExtraContent={{
          right: (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => handleCloseOthers(activeKey)}>
                关闭其他
              </Button>
              <Button size="small" onClick={handleCloseAll}>
                关闭所有
              </Button>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default TabsLayout;
