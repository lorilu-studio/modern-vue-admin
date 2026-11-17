# 快速开始与功能边界

安装依赖并启动开发服务器：

```bash
npm ci
npm run dev
```

默认地址由 Vite 输出，通常为 `http://localhost:3000`。开发环境使用 `.env.development` 启用 Mock；`VITE_MOCK_DEMO_ROLE` 可设为 `admin`、`operator`、`viewer` 以检查不同菜单和按钮权限。修改环境变量后重启开发服务器。Mock 登录不验证密码，页面 CRUD 数据刷新后消失。

项目的静态路由在 `src/router/index.ts`，动态菜单由 `mock/menu.mock.ts` 演示。布局、主题与语言入口分别在 `src/layout/`、`src/store/modules/settings.ts` 和 `src/lang/`。前端权限只控制界面，真实业务接口必须由后端授权。
