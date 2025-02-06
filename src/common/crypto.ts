import NodeRSA from 'node-rsa';
import { getPubKey } from '@/services/ant-design-pro/api';

async function initial() {
  const result = await getPubKey();
  if (result?.data) {
    return new NodeRSA(result?.data);
  } else {
    console.log('RSA Key 加载失败……');
  }
}

const key: NodeRSA = await initial();

/**
 * 加密
 * @param text
 */
export function encrypt(text) {
  const bufferToEncrypt = key.encrypt(text);
  return key.encrypt(bufferToEncrypt, 'base64');
}
