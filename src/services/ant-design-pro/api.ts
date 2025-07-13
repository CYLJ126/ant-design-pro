// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { message } from 'antd';

/**
 * jsonPost 请求后端
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
    }
  });
}

/**
 * jsonPost 请求后端返回列表，以处理列表统计数据，如总数等
 *
 * @param path 请求路径
 * @param data 请求参数
 * @param options 请求时的选项
 * @return ResultContext 类型
 */
export function jsonPostList(path, data, options?: { [key: string]: any }) {
  return request<API.ResultContext>('/nip' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
  }).then((resultContext) => {
    if (resultContext.success) {
      return resultContext;
    }
  });
}

/**
 * batchPost 请求后端，返回 statistics 节点，批量操作结果
 *
 * @param path 请求路径
 * @param data 请求参数
 * @param options 请求时的选项
 * @return ResultContext 类型
 */
export function batchPost(path, data, options?: { [key: string]: any }) {
  return request<API.ResultContext>('/nip' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
  }).then((resultContext) => {
    if (resultContext.success) {
      return resultContext.statistics;
    }
  });
}

/**
 * 请求 Blob 数据
 *
 * @param path 请求路径
 * @param data 请求参数
 * @param options 请求配置项
 */
export function jsonBlob(path, data, options?: { [key: string]: any }) {
  return request<API.ResultContext>('/nip' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
    responseType: 'blob',
  }).then((resp) => {
    if (resp) {
      return resp;
    } else {
      message.error(`Blob 请求出错`).then((r) => {});
    }
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
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
