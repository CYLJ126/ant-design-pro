import { request } from '@umijs/max';

/** 获取用户标签 POST /nip/base/tag/list.do */
export async function getTags(data, options?: { [key: string]: any }) {
  return request<any>('/nip/base/tag/listTags.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
  });
}
