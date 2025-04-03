import { jsonPost } from './api';

/**  ----------------- HomePageController start ----------------- */

/** 获取首页闻链接 POST /homePage/listWebsiteNews */
export async function listWebsiteNews(param) {
  return jsonPost('/homePage/listWebsiteNews', param);
}

/**  ----------------- HomePageController end ----------------- */
