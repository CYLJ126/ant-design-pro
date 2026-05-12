/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */

import DynamicForm from './DynamicForm';
import { FormFieldConfig } from './DynamicForm/FormField';
import Footer from './Footer';
import MyColorPicker from './MyColorPicker';
import { DocLink, LangDropdown, VersionDropdown } from './RightContent';
import { AvatarDropdown } from './RightContent/AvatarDropdown';
import SearchForm from './SearchForm';
import type { ActionButton, TableColumn } from './SimpleTable';
import SimpleTable from './SimpleTable';
import TimeHeader from './TimeHeader';

// import TagsSelector from './TagsSelector';
// TagsSelector 添加后页面变成空白
// export { default as TagsSelector } from './TagsSelector';

/**
 * 业务组件
 */
export { default as ArticleListContent } from './ArticleListContent';
export { default as AvatarList } from './AvatarList';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as OfflineBanner } from './OfflineBanner';
export { default as StandardFormRow } from './StandardFormRow';
export { default as TagSelect } from './TagSelect';

export {
  type ActionButton,
  AvatarDropdown,
  DocLink,
  DynamicForm,
  Footer,
  FormFieldConfig,
  LangDropdown,
  MyColorPicker,
  SearchForm,
  SimpleTable,
  type TableColumn,
  TimeHeader,
  VersionDropdown,
};
