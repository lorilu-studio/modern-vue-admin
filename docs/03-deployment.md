# 部署

```bash
npm ci
npm run build
```

将 `dist/` 部署到静态托管服务。路由使用 hash history，见 `src/router/index.ts`。生产环境 `.env.production` 使用 `/prod-api` 前缀；托管服务需将该前缀代理到真实后端，或按实际后端修改环境配置后重新构建。

`mock/` 仅用于开发服务器，静态产物不提供登录和菜单 API。发布前用真实后端验证登录、刷新、直接打开深层链接、权限拒绝及登出。
