// https://cn.vitejs.dev/guide/env-and-mode

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// TypeScript 类型提示都为 string： https://github.com/vitejs/vite/issues/6930
interface ImportMetaEnv {
  /** 应用端口 */
  VITE_APP_PORT: string;
  /** API 基础路径(代理前缀) */
  VITE_APP_BASE_API: string;
  /** API 地址 */
  VITE_APP_API_URL: string;
  /** 是否开启 Mock 服务 */
  VITE_MOCK_DEV_SERVER: string;
  /** Mock 演示角色 */
  VITE_MOCK_DEMO_ROLE?: string;
  /** 开发服务监听地址；未配置时仅 localhost */
  VITE_DEV_HOST?: string;
  /** 是否自动打开浏览器；仅字符串 true 启用 */
  VITE_DEV_OPEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示
 */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    engines: {
      node: string;
    };
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  buildTimestamp: number;
};
