Language : 🇺🇸 | [🇨🇳](./README.zh-CN.md) | [🇷🇺](./README.ru-RU.md) | [🇹🇷](./README.tr-TR.md) | [🇯🇵](./README.ja-JP.md) | [🇫🇷](./README.fr-FR.md) | [🇵🇹](./README.pt-BR.md) | [🇸🇦](./README.ar-DZ.md) | [🇪🇸](./README.es-ES.md)

<h1 align="center">Ant Design Pro</h1>

<div align="center">

An out-of-box UI solution for enterprise applications as a React boilerplate.

[![Node CI](https://github.com/ant-design/ant-design-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/ant-design/ant-design-pro/actions/workflows/ci.yml) [![Preview Deploy](https://github.com/ant-design/ant-design-pro/actions/workflows/preview-deploy.yml/badge.svg)](https://github.com/ant-design/ant-design-pro/actions/workflows/preview-deploy.yml) [![Build With Umi](https://img.shields.io/badge/build%20with-umi-028fe4.svg?style=flat-square)](http://umijs.org/) ![](https://badgen.net/badge/icon/Ant%20Design?icon=https://gw.alipayobjects.com/zos/antfincdn/Pp4WPgVDB3/KDpgvguMpGfqaHPjicRK.svg&label)

![](https://github.com/user-attachments/assets/fde29061-3d9a-4397-8ac2-397b0e033ef5)

</div>

- Preview: http://preview.pro.ant.design
- Home Page: http://pro.ant.design
- Documentation: http://pro.ant.design/docs/getting-started
- ChangeLog: http://pro.ant.design/docs/changelog
- FAQ: http://pro.ant.design/docs/faq

## 5.0 is out! 🎉🎉🎉

[Ant Design Pro 5.0.0](https://github.com/ant-design/ant-design-pro/issues/8656)

## Translation Recruitment :loudspeaker:

We need your help: https://github.com/ant-design/ant-design-pro/issues/120

## Features

- :bulb: **TypeScript**: A language for application-scale JavaScript
- :scroll: **Blocks**: Build page with block template
- :gem: **Neat Design**: Follow [Ant Design specification](http://ant.design/)
- :triangular_ruler: **Common Templates**: Typical templates for enterprise applications
- :rocket: **State of The Art Development**: Newest development stack of React/umi/dva/antd
- :iphone: **Responsive**: Designed for variable screen sizes
- :art: **Theming**: Customizable theme with simple config
- :globe_with_meridians: **International**: Built-in i18n solution
- :gear: **Best Practices**: Solid workflow to make your code healthy
- :1234: **Mock development**: Easy to use mock development solution
- :white_check_mark: **UI Test**: Fly safely with unit and e2e tests

## Templates

```
- Dashboard
  - Analytic
  - Monitor
  - Workspace
- Form
  - Basic Form
  - Step Form
  - Advanced From
- List
  - Standard Table
  - Standard List
  - Card List
  - Search List (Project/Applications/Article)
- Profile
  - Simple Profile
  - Advanced Profile
- Account
  - Account Center
  - Account Settings
- Result
  - Success
  - Failed
- Exception
  - 403
  - 404
  - 500
- User
  - Login
  - Register
  - Register Result
```

## Usage

### Use bash

We provide pro-cli to quickly initialize scaffolding.

```bash
# use npm
npm i @ant-design/pro-cli -g
pro create myapp
```

select umi version

```shell
🐂 Use umi@4 or umi@3 ? (Use arrow keys)
❯ umi@4
  umi@3
```

> If the umi@4 version is selected, full blocks are not yet supported.

If you choose umi@3, you can also choose the pro template. Pro is the basic template, which only provides the basic content of the framework operation. Complete contains all blocks, which is not suitable for secondary development as a basic template.

```shell
? 🚀 Full or a simple scaffold? (Use arrow keys)
❯ simple
  complete
```

Initialized Git repository:

```shell
$ git init myapp
```

Install dependencies:

```shell
$ cd myapp && tyarn
// or
$ cd myapp && npm install
```

## Browsers support

Modern browsers.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Use Ant Design Pro in your daily work.
- Submit [issues](http://github.com/ant-design/ant-design-pro/issues) to report bugs or ask questions.
- Propose [pull requests](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.

## 添加页面

- `\src\pages` ：创建文件夹，以大写开头，并实现页面内容；
- `\config\routes.ts` ：添加路由；
- `\src\locales\en-US\menu.ts` ：添加英文本地化内容；
- `\src\locales\zh-CN\menu.ts` ：添加中文本地化内容；

## Git 提交规范

**前缀**

- feat：新增功能或页面；
- delete：删除功能或文件；
- fix：修复 bug、解决冲突（尽量避免）；
- modify：修改功能；
- docs：修改文档；
- refactor：代码重构，未新增任何功能和修复任何 bug；
- build：改变构建流程，新增依赖库、工具等（例如 webpack 修改）；
- style：仅仅修改了空格、缩进、注释等，不改变代码逻辑的变动；
- perf：改善性能和体现的修改；
- chore：非 src 和 test 的修改；
- test：测试用例的新增、修改；
- ci：自动化流程（持续集成，Continuous Integration）相关修改；
- revert：回滚到上一个版本；
- scope：【可选】用于说明 commit 的影响范围；
- subject：commit 的简要说明，尽量简短；
- revert：撤销之前的提交；
- merge：合并分支或解决冲突；
- release：发布一个版本；
- hotfix：发布紧急修补补丁；
- config：配置文件的更改；
- data：与数据相关的更改，如数据库操作、数据结构等；
- init：初始化或创建项目；
- migration：数据库迁移或数据迁移相关的更改；
- perf 或 performance：性能优化相关的更改；
- security：与安全性相关的更改；
- i18n：国际化（Internationalization）相关的更改；
- log：日志相关的更改；
- restyle：调整样式或外观相关的更改；
- vendor：更新或修改依赖的第三方库或模块；

**说明**

- 格式：前缀+英文冒号+空格+描述，其中“描述”的第一个字符不得为大写字母（不能为句子）；
- 提交文字规范：提交前缀：动作行为 + 问题内容；
- 提交的 commit 发现不符合规范，`git commit --amend -m "新的提交信息"` 或 `git reset --hard HEAD^` 重新提交一次；
-
