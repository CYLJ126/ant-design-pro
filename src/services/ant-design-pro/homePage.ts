import { jsonPost } from './api';

/**  ----------------- HomePageController start ----------------- */

/** 获取首页闻链接 POST /homePage/websiteInfo/listWebsiteNews */
export async function listWebsiteNews(param) {
  return jsonPost('/homePage/websiteInfo/listWebsiteNews', param);
}

/**  ----------------- HomePageController end ----------------- */
