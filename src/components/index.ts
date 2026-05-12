/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */
import Footer from './Footer';
import { DocLink, LangDropdown, VersionDropdown } from './RightContent';
import { AvatarDropdown } from './RightContent/AvatarDropdown';
import type {ActionButton, TableColumn} from './SimpleTable';
import SimpleTable from './SimpleTable';
import SearchForm from './SearchForm';
import DynamicForm from './DynamicForm';
import TimeHeader from './TimeHeader';
import MyColorPicker from './MyColorPicker';
// import { FormFieldConfig } from './DynamicForm/FormField';
// import TagsSelector from './TagsSelector';

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
    AvatarDropdown,
    DocLink,
    Footer,
    LangDropdown,
    VersionDropdown,
    ActionButton,
    TableColumn,
    SimpleTable,
    SearchForm,
    DynamicForm,
    TimeHeader,
    MyColorPicker,
};
// export { AvatarDropdown, DocLink, Footer, LangDropdown, VersionDropdown, SimpleTable, ActionButton, TableColumn, TimeHeader, MyColorPicker, TagsSelector, SearchForm, DynamicForm, FormFieldConfig,};
