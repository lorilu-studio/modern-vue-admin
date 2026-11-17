# 示例精简与升级

示例页面集中在 `src/views/demo/`，对应菜单数据在 `mock/menu.mock.ts`。移除页面时一并调整菜单组件路径、`src/views/dashboard/index.vue` 的快捷入口和相关 API 引用；先全局搜索该路径，再运行类型检查、测试及构建。当前仓库没有一键精简命令。

升级依赖时使用 npm，并提交 `package-lock.json`。按 Vite、Vue 和 Element Plus 的迁移说明逐个主版本升级，完成后运行 README 中的全部检查，再人工验证登录、权限、菜单、标签页和主题。当前尚无逐版本迁移记录。
