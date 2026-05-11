import {jsonPost} from './api';

/**  ----------------- ArticleController start ----------------- */

/**
 * 获取文章内容
 *
 * @param id 文章 ID
 */
export async function getArticleById(id: number) {
  return jsonPost('/richText/article/getArticleById', {id});
}

/**
 * 创建新文章
 *
 * @param param 文章信息
 */
export async function addArticle(param: any) {
  return jsonPost('/richText/article/addArticle', param);
}

/**
 * 更新文章内容
 *
 * @param param 文章内容
 */
export async function updateArticle(param: any) {
  return jsonPost('/richText/article/updateArticle', param);
}

/**  ----------------- ArticleController end ----------------- */
