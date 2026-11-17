<!-- 左侧边菜单：包括左侧布局(left)、顶部布局(all)、混合布局(left) -->
<template>
  <el-menu
    ref="menuRef"
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    :ellipsis="false"
    :unique-opened="false"
    :collapse-transition="false"
    :mode="mode"
    @open="handleOpen"
    @close="handleClose"
  >
    <SidebarMenuItem
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="resolvePath(route.path)"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import { useSettingsStore, useAppStore } from "@/store";
import { isExternal } from "@/utils/index";
import path from "path-browserify";
import { LayoutEnum } from "@/enums/LayoutEnum";
import type { MenuInstance } from "element-plus";

const menuRef = ref<MenuInstance>();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const currentRoute = useRoute();
const props = defineProps({
  menuList: {
    required: true,
    default: () => {
      return [];
    },
    type: Array<any>,
  },
  basePath: {
    type: String,
    required: true,
  },
});
const mode = computed(() => {
  return settingsStore.layout === LayoutEnum.TOP ? "horizontal" : "vertical";
});

/**
 * 解析路径
 *
 * @param routePath 路由路径 /user
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }

  // 完整绝对路径 = 父级路径(/system) + 路由路径(/user)
  const fullPath = path.resolve(props.basePath, routePath);
  return fullPath;
}
/**
 * 修复切换到horizontal时，展开的菜单显示问题，切换时关闭全部菜单
 */
const menuIndexArray = ref<string[]>([]);
const handleOpen = (index: string, keyPath: string[]) => {
  menuIndexArray.value.push(index);
};
const handleClose = (index: string) => {
  menuIndexArray.value = menuIndexArray.value.filter((item) => item !== index);
};
watch(
  () => mode.value,
  () => {
    if (mode.value === "horizontal") {
      menuIndexArray.value.map((item: string) => menuRef.value!.close(item));
    }
  }
);
</script>

<style lang="scss" scoped>
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 44px;
  margin: 3px 12px;
  line-height: 44px;
  border-radius: 6px;
  transition:
    color var(--app-motion-fast),
    background-color var(--app-motion-fast);
}

:deep(.el-menu-item.is-active) {
  font-weight: 600;
  color: var(--app-primary);
  background: var(--app-sidebar-active-bg);
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  font-weight: 550;
  color: var(--app-sidebar-text-strong);
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  margin-right: 8px;
  margin-left: 8px;
}
</style>
