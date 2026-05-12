/**
 * 布局组件
 */

import { FormFieldConfig } from './DynamicForm/FormField';
import Footer from './Footer';
import { DocLink, LangDropdown, VersionDropdown } from './RightContent';
import { AvatarDropdown } from './RightContent/AvatarDropdown';
/**
 * 业务组件
 */
import type { ActionButton, TableColumn } from './SimpleTable';

export { default as ArticleListContent } from './ArticleListContent';
export { default as AvatarList } from './AvatarList';
export { default as DynamicForm } from './DynamicForm';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as MyColorPicker } from './MyColorPicker';
export { default as OfflineBanner } from './OfflineBanner';
export { default as SearchForm } from './SearchForm';
export { default as SimpleTable } from './SimpleTable';
export { default as StandardFormRow } from './StandardFormRow';
export { default as TagSelect } from './TagSelect';
export { default as TimeHeader } from './TimeHeader';

// TagsSelector 添加后页面变成空白
// export { default as TagsSelector } from './TagsSelector';

export {
  type ActionButton,
  AvatarDropdown,
  DocLink,
  Footer,
  FormFieldConfig,
  LangDropdown,
  type TableColumn,
  VersionDropdown,
};
