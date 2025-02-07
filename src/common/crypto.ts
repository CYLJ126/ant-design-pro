import NodeRSA from 'node-rsa';
import { getPubKey } from '@/services/ant-design-pro/api';

async function initial() {
  const result = await getPubKey();
  if (result?.data) {
    const rsa = new NodeRSA(result.data, 'pkcs8-public-pem');
    rsa.setOptions({ encryptionScheme: 'pkcs1' });
    return rsa;
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
  return key.encrypt(text, 'base64');
}
