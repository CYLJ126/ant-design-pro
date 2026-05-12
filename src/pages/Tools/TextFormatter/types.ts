/**
 * 格式化配置选项
 */
export interface CustomProperty {
  zhOrEn: boolean; // true-中文；false-英文；
  punctuationMark: boolean; // true-替换标点符号；false-不替换标点符号；
  clearBreakLine: boolean; // true-消除换行；false-不消除换行；
  compressSpace: boolean; // true-压缩空格；false-不压缩空格；
  withSpace: boolean; // true-英文、数字前后带空格；false-英文、数字前后不带空格；
  pasteFromClipboard: boolean; // true-从粘贴板复制内容到文本框中；false-不从粘贴板复制内容到文本框中；
  rewriteClipboard: boolean; // true-处理后复制到粘贴板；false-处理后不复制到粘贴板；
  isHandleClipboard: boolean; // true-从粘贴板复制内容到文本框中；false-不从粘贴板复制内容到文本框中；
  handleList: boolean; // true-处理成列表内容；false-默认，正常文本处理；
  handleMarkdownTable: boolean; // true-处理Markdown表格；false-默认，正常文本处理；
}

/**
 * 列表形内容配置选项
 */
export interface ListProperty {
  removePrefixLength: number; // 要删除的前缀长度；
  autoRemovePrefix: boolean; // 是否自动去除列表前缀（如1. 2. 1、等）
  serialMark: string; // 编号类型
  endWith: string; // 要添加或替换的结束符
  withBlankLine: boolean; // true-默认，添加空行；false-不添加空行；
  lastWithPeriod: boolean; // 最后是否以句号结束，默认为 true；
  singleLineMode: boolean; // true-单行标序模式，正常列表处理；false-只做基础文本处理；
}

/**
 * markdown 表格配置选项
 */
export interface MarkdownTableProperty {
  removeBold: boolean; // true-去除表格中的加粗；false-保留表格中的加粗；
  compressSpaces: boolean; // true-压缩表格中的空格；false-不压缩表格中的空格；
  borderAlignment: string; // 表格边框对齐方式，可选值：none、left、right、center（默认：center）
  cellSeparator: string; // 单元格分隔符，默认为空格
}

/**
 * 文本对象
 */
export interface TextPair {
  raw: string; // 原内容
  formatted: string; // 格式化后的内容
}

/**
 * 序号标记配置
 */
export interface SerialMarkConfig {
  value: string;
  label: string;
}
