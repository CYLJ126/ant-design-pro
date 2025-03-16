import { jsonPost } from './api';
// 格式化时间为本地时间
import 'dayjs/locale/zh-cn';

/**  ----------------- MenuController start ----------------- */
/**
 * 获取菜单
 *
 * @param data 请求参数
 */
export async function listRecursiveMenus(data) {
  return jsonPost('/rbac/menu/listRecursiveMenus', data);
}

/**  ----------------- MenuController end ----------------- */
