<template>
  <el-drawer
    v-model="settingsVisible"
    size="360"
    title="界面设置"
    class="settings-drawer"
  >
    <section class="settings-section">
      <div class="settings-heading">
        <strong>外观</strong>
        <span>选择主题模式和品牌色</span>
      </div>
      <el-radio-group v-model="settingsStore.theme" class="theme-options">
        <el-radio-button :value="ThemeEnum.LIGHT">浅色</el-radio-button>
        <el-radio-button :value="ThemeEnum.DARK">深色</el-radio-button>
        <el-radio-button :value="ThemeEnum.AUTO">跟随系统</el-radio-button>
      </el-radio-group>
      <div class="setting-item">
        <span>品牌色</span>
        <ThemeColorPicker
          v-model="settingsStore.themeColor"
          @update:model-value="settingsStore.changeThemeColor"
        />
      </div>
    </section>

    <section class="settings-section">
      <div class="settings-heading">
        <strong>导航</strong>
        <span>切换后台框架的菜单结构</span>
      </div>
      <LayoutSelect
        v-model="settingsStore.layout"
        @update:model-value="changeLayout"
      />
      <div class="setting-item">
        <span>多页签</span>
        <el-switch v-model="settingsStore.tagsView" />
      </div>
      <div class="setting-item">
        <span>固定头部</span>
        <el-switch v-model="settingsStore.fixedHeader" />
      </div>
      <div class="setting-item">
        <span>显示 Logo</span>
        <el-switch v-model="settingsStore.sidebarLogo" />
      </div>
    </section>

    <section class="settings-section">
      <div class="settings-heading">
        <strong>辅助</strong>
        <span>控制组件尺寸和页面标识</span>
      </div>
      <div class="setting-item setting-item--stack">
        <span>组件尺寸</span>
        <el-radio-group
          :model-value="appStore.size"
          @update:model-value="changeSize"
        >
          <el-radio-button :value="SizeEnum.LARGE">宽松</el-radio-button>
          <el-radio-button :value="SizeEnum.DEFAULT">默认</el-radio-button>
          <el-radio-button :value="SizeEnum.SMALL">紧凑</el-radio-button>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span>全屏显示</span>
        <el-switch :model-value="isFullscreen" @update:model-value="toggle" />
      </div>
      <div class="setting-item">
        <span>页面水印</span>
        <el-switch v-model="settingsStore.watermarkEnabled" />
      </div>
    </section>
  </el-drawer>
</template>

<script setup lang="ts">
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
import { LayoutEnum } from "@/enums/LayoutEnum";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { SizeEnum } from "@/enums/SizeEnum";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const { isFullscreen, toggle } = useFullscreen();

const settingsVisible = computed({
  get: () => settingsStore.settingsVisible,
  set: (visible: boolean) => {
    settingsStore.settingsVisible = visible;
  },
});

function changeSize(size: string | number | boolean | undefined) {
  if (typeof size === "string") appStore.changeSize(size);
}

function changeLayout(layout: string) {
  settingsStore.changeLayout(layout);
  if (layout === LayoutEnum.MIX && route.name) {
    againActiveTop(route.name as string);
  }
}

function againActiveTop(name: string) {
  const parent = findOutermostParent(permissionStore.routes, name);
  if (parent?.path && appStore.activeTopMenuPath !== parent.path) {
    appStore.activeTopMenu(parent.path);
  }
}

function findOutermostParent(tree: any[], findName: string) {
  const parentMap: Record<string, any> = {};

  function buildParentMap(node: any, parent: any) {
    parentMap[node.name] = parent;
    node.children?.forEach((child: any) => buildParentMap(child, node));
  }

  tree.forEach((node) => buildParentMap(node, null));
  let currentNode = parentMap[findName];
  while (currentNode && parentMap[currentNode.name]) {
    currentNode = parentMap[currentNode.name];
  }
  return currentNode;
}
</script>

<style lang="scss" scoped>
.settings-section {
  display: grid;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--app-border-color);

  &:first-child {
    padding-top: 4px;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.settings-heading {
  display: grid;
  gap: 4px;

  span {
    font-size: 12px;
    color: var(--app-text-secondary);
  }
}

.theme-options {
  width: 100%;

  :deep(.el-radio-button) {
    flex: 1;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  color: var(--app-text-secondary);
}

.setting-item--stack {
  display: grid;
  gap: 10px;
}
</style>
