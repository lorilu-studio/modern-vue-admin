# modern-vue-admin

[简体中文](./README.md) | [English](./README.en.md)

基于 Vue 3、TypeScript、Vite、Pinia 和 Element Plus 的后台模板。包含动态菜单、角色与按钮权限示例、多布局、主题切换、标签页、Mock 和 CRUD 页面。

当前版本 1.0.0。项目使用 [Apache-2.0 许可证](./LICENSE)。这是应用模板，不是 npm 库。演示数据只保存在页面内存中，真实接口和服务端鉴权需自行接入。

## 快速开始

需要 Node.js 18.18+ 和 npm 9+。

```bash
npm ci
npm run dev
```

打开 Vite 输出的地址，默认 `http://localhost:3000`。开发环境默认启用 Mock，登录演示账号为 `admin` / `123456`。Mock 不校验登录密码，也不提供真实鉴权，请勿作为公开服务部署。

## 验证

```bash
npm run check:config
npm run type-check
npm run lint:eslint
npm run lint:style
npm run format:check
npm test
npm run build
```

## 文档

- [快速开始与功能边界](./docs/01-getting-started.md)
- [真实接口接入](./docs/02-api-integration.md)
- [部署](./docs/03-deployment.md)
- [安全问题反馈](./docs/04-security.md)
- [参与贡献](./docs/05-contributing.md)
- [版本记录](./docs/06-changelog.md)
- [示例精简与升级](./docs/07-customization.md)
- [维护路线](./docs/08-roadmap.md)
- [社区行为准则](./docs/09-code-of-conduct.md)
