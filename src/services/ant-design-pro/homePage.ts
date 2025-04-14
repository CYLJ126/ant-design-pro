import { jsonPost, jsonBlob } from './api';

/**  ----------------- WebsiteInfoController start ----------------- */

/** 获取首页闻链接 POST /homePage/websiteInfo/listWebsiteNews */
export async function listWebsiteNews(param) {
  return jsonPost('/homePage/websiteInfo/listWebsiteNews', param);
}

/**
 * 获取新闻网站的图标
 *
 * @param logoUrl 图标地址
 */
export async function getWebsiteLogo(logoUrl) {
  return jsonBlob('/homePage/websiteInfo/getWebsiteLogo', { logoUrl: logoUrl });
}

/**  ----------------- WebsiteInfoController end ----------------- */
