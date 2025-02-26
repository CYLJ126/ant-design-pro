// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { message } from 'antd';

/**
 * jsonPost 请求后端
 * 如果是列表请求，则需要新加一个方法，以处理列表统计数据，如总数等
 *
 * @param path 请求路径
 * @param data 请求参数
 * @param options 请求时的选项
 * @return ResultContext 类型
 */
export function jsonPost(path, data, options?: { [key: string]: any }) {
  return request<API.ResultContext>('/nip' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
  }).then((resultContext) => {
    if (resultContext.success) {
      return resultContext.data;
    } else {
      const errMsg = resultContext.desc?.subString(0, 40);
      message.error(`错误码【${resultContext.code}】错误信息【${errMsg}】`).then((r) => {});
    }
  });
}

/** 获取公钥，用于加密敏感信息 POST /nip/auth/getPubKey */
export async function getPubKey(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/nip/auth/getPubKey', {
    method: 'POST',
    ...(options ?? {}),
  });
}

/** 获取当前用户信息 POST /nip/auth/onlineInfo */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/nip/auth/onlineInfo', {
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

/** 登录接口 POST /nip/auth/login */
export async function login(
  body: {
    password: string | undefined;
    name: string | undefined;
    autoLogin: boolean | undefined;
  },
  options?: { [p: string]: any },
) {
  return request<API.LoginResult>('/nip/auth/login', {
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
