import { request } from '@umijs/max';
import { jsonPost } from './api';

/**  ----------------- TagController start ----------------- */

/** 获取用户标签 POST /nip/base/tag/listTags */
export async function getTags(param) {
  return jsonPost('/base/tag/listTags', param);
}

export async function getSubTags(param) {
  const result = await getTags({ ...param, status: 'DOING' });
  return (
    result?.map((item) => {
      return { value: item.id, label: item.name };
    }) || []
  );
}

export async function listRecursive(param) {
  return jsonPost('/base/tag/listRecursive', param);
}

/**
 * 插入标签
 * @param param 标签对象
 */
export async function addTag(param) {
  return jsonPost('/base/tag/addTag', param);
}

/**
 * 更新标签
 * @param param 标签对象
 */
export async function updateTag(param) {
  return jsonPost('/base/tag/updateTag', param);
}

/**
 * 删除标签
 * @param id 标签 ID
 */
export async function deleteTag(id?: number) {
  return jsonPost('/base/tag/deleteTag', { id: id });
}

/**
 * 标签重排序
 * @param params 标签列表
 */
export async function reorderTags(params) {
  return jsonPost('/base/tag/reorderTags', params);
}

/**  ----------------- TagController end ----------------- */

/**  ----------------- AuthorizationController start ----------------- */

/** 获取公钥，用于加密敏感信息 POST /nip/auth/getPubKey */
export async function getPubKey() {
  return jsonPost('/auth/getPubKey', {});
}

/** 获取当前用户信息 POST /nip/auth/onlineInfo */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/nip/auth/onlineInfo', {
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

/**  ----------------- AuthorizationController end ----------------- */

/**  ----------------- SummaryController start ----------------- */
/**
 * 获取总结内容
 *
 * @param type 对应类型
 * @param targetId 对应目标 ID
 */
export async function getSummaryById(type: string, targetId: string) {
  return jsonPost('/base/summary/getSummaryById', { type: type, targetId: targetId });
}

/**
 * 插入或更新总结
 *
 * @param data 总结对象，无 id 字段说明是插入，有 id 则为更新
 */
export async function saveSummary(data) {
  return jsonPost('/base/summary/saveSummary', data);
}

/**  ----------------- SummaryController end ----------------- */
