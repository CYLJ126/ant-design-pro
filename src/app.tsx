import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { AliveScope } from 'react-activation';
import TabsLayout from '@/components/TabsLayout';
import IconMap from '@/icons/IconMap';
import { queryCurrentUser } from '@/services/ant-design-pro/base';
import { listRecursiveMenus } from '@/services/ant-design-pro/rbac';

// Initialize dayjs plugins globally
dayjs.extend(relativeTime);

import {
  AvatarDropdown,
  DocLink,
  ErrorBoundary,
  Footer,
  LangDropdown,
  OfflineBanner,
  VersionDropdown,
} from '@/components';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const loginRoute = {
  path: '/user',
  layout: false,
  routes: [
    {
      name: 'login',
      path: '/user/login',
    },
  ],
};

/**
 * 菜单转换
 * 由于 ant design pro 项目中，图标不支持从后端获取配置后直接转换，所以需要前端加一个映射
 * 配置可参见官网：https://umijs.org/docs/max/layout-menu
 * @param rawMenu 后端的菜单配置信息
 * @param userMenuCodes 前端支持的菜单集合
 */
function transfer(rawMenu: any, userMenuCodes: string[]) {
  if (!userMenuCodes.includes(rawMenu.menuCode)) {
    return null;
  }
  const one = {
    id: rawMenu.id,
    name: rawMenu.menuCode,
    path: rawMenu.menuUrl,
    icon: IconMap[rawMenu.icon] || '',
  };
  if (rawMenu.children && rawMenu.children.length > 0) {
    one.routes = rawMenu.children
      .map((subRawMenu: any) => transfer(subRawMenu, userMenuCodes))
      .filter((one: any) => one);
  }
  return one;
}

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  settingDrawerOpen?: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      if (!localStorage.getItem('user_token')) {
        // 还未登录时，刷新页面，此时，不去获取用户信息
        return undefined;
      }
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      const user = msg.data;
      // 权限，前后端字段兼容
      user.access = user.authorities;
      user.userid = user.id;
      // TODO 处理主题配置

      return user;
    } catch (_error) {
      const { pathname, search, hash } = history.location;
      history.replace(
        `${loginPath}?redirect=${encodeURIComponent(pathname + search + hash)}`,
      );
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
      settingDrawerOpen: false,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
    settingDrawerOpen: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    // TODO RightContent
    menu: {
      params: {
        // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request https://beta-pro.ant.design/docs/advanced-menu-cn
        userId: initialState?.currentUser?.userid,
      },
      request: async () => {
        if (!initialState?.currentUser?.userid) {
          // 没登录返回登录 route，不显示菜单
          return [loginRoute];
        }
        let rawMenus: Array<any>;
        try {
          rawMenus = await listRecursiveMenus({ status: 1 });
        } catch (e) {
          console.log('从后端获取菜单异常', e);
          rawMenus = [];
        }
        const userMenuCodes: string[] = initialState?.currentUser?.menus || [];
        return rawMenus
          .filter((one: any) => userMenuCodes.includes(one.menuCode))
          .map((rawMenu: any) => transfer(rawMenu, userMenuCodes));
      },
    },
    onCollapse: (collapsed) => {
      setInitialState({
        ...initialState,
        settings: { ...initialState.settings, collapsed },
      });
    },
    actionsRender: () => [
      <DocLink key="doc" />,
      <VersionDropdown key="version" />,
      <LangDropdown key="lang" />,
    ],
    // defaultCollapsed: true, // 菜单默认折叠
    breakpoint: false, // 用于控制在屏幕小于指定尺寸时，自动收起菜单栏，若需要 defaultCollapsed 配置为 true 使页面默认收起菜单栏的话，必须要设置该值为 false
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: 'ProUser',
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    // waterMarkProps: {
    // 水印
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`,
        );
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    // Replace ProLayout's default ErrorBoundary with our offline-aware version,
    // so chunk load errors show friendly messages instead of "Something went wrong."
    ErrorBoundary,
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: React.ReactNode, props: any) => {
      // 在登录页面不使用 AliveScope
      if (props?.location?.pathname?.startsWith('/user/')) {
        return children;
      }

      return (
        <>
          <TabsLayout />
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : 'https://pro-api.ant-design-demo.workers.dev',
  ...errorConfig,
};

export function rootContainer(container: React.ReactNode) {
  return (
    <AliveScope>
      <OfflineBanner />
      <ErrorBoundary>{container}</ErrorBoundary>
    </AliveScope>
  );
}
