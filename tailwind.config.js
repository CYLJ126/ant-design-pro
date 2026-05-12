module.exports = {
  // ✅ content 必须是合法数组，不能省略
  content: ['./src/**/*.{js,jsx,ts,tsx}', './config/**/*.{js,ts}'],
  // ✅ 与 antd 主题共存，必须关闭 preflight（避免样式冲突）
  corePlugins: {
    preflight: false,
  },
  // ✅ 添加前缀避免与 antd 类名冲突（可选但推荐）
  prefix: 'tw-',
  theme: {
    extend: {},
  },
};
