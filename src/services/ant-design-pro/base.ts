import { request } from '@umijs/max';

/** 获取用户标签 POST /nip/base/tag/listTags */
export async function getTags(data, options?: { [key: string]: any }) {
  return request<any>('/nip/base/tag/listTags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options ?? {}),
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
