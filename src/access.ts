/**
 * 权限配置，示例：
 * 后端返回的用户信息的 authorities 属性中包含 Admin，且 route.ts 中的 /admin 页面 access 权限配置为 Admin，则可访问 /admin 页面
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    Admin: currentUser?.access?.includes('Admin'),
    Personal: currentUser?.access?.includes('Personal'),
    Tools: currentUser?.access?.includes('Tools'),
    TextFormatter: currentUser?.access?.includes('TextFormatter'),
  };
}
