import { request } from '@umijs/max';

/** 获取公钥，用于加密敏感信息 POST /nip/base/tag/list.do */
export async function getTags(data, options?: { [key: string]: any }) {
  return request<any>('/nip/base/tag/list.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
  });
}
