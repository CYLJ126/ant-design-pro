// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取公钥，用于加密敏感信息 POST /nip/auth/getPubKey.pub */
export async function getPubKey(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/nip/auth/getPubKey.pub', {
    method: 'POST',
    ...(options ?? {}),
  });
}

/** 获取当前用户信息 POST /nip/auth/onlineInfo.pub */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/nip/auth/onlineInfo.do', {
    method: 'POST',
    ...(options ?? {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options ?? {}),
  });
}

/** 登录接口 POST /nip/auth/login.pub */
export async function login(
  body: {
    password: string | undefined;
    name: string | undefined;
    autoLogin: boolean | undefined;
  },
  options?: { [p: string]: any },
) {
  return request<API.LoginResult>('/nip/auth/login.pub', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options ?? {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options ?? {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options ?? {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options ?? {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options ?? {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options ?? {}),
    },
  });
}
