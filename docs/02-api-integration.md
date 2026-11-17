# 真实接口接入

请求封装位于 `src/utils/request.ts`，API 模块位于 `src/api/`。请求地址以 `VITE_APP_BASE_API` 为前缀，开发代理目标由 `VITE_APP_API_URL` 指定。请先核对后端返回的 `code`、`data`、`msg` 结构与 `src/enums/ResultEnum.ts`，以及登录返回的 `tokenType`、`accessToken`。

登录、用户信息和菜单分别由 `src/api/auth.ts`、`src/api/user.ts`、`src/api/menu.ts` 请求。菜单组件路径须对应 `src/views/` 下的 Vue 文件。`src/api/user-management.ts` 给出用户管理接口类型，但当前 `src/views/demo/access/users.vue` 使用页面内存数据，接入真实业务时需将这些操作接到 API，并在后端逐接口鉴权。

所有 `VITE_` 变量都会进入客户端资源，不要存放密钥。生产部署需自行配置真实 API 地址、跨域和会话过期响应契约。
