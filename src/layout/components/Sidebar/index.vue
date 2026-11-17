<template>
  <div
    :class="{
      'has-logo': sidebarLogo,
      'sidebar-content--vertical': layout === LayoutEnum.LEFT,
    }"
  >
    <!-- layout mix-->
    <div class="flex w-full" v-if="layout == LayoutEnum.MIX">
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <SidebarMixTopMenu class="flex-1" />
      <NavbarAction />
    </div>
    <!-- layout left || layout top -->
    <template v-else>
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <el-scrollbar class="sidebar-menu-scrollbar">
        <SidebarMenu :menu-list="permissionStore.routes" base-path="" />
      </el-scrollbar>
      <NavbarAction v-if="layout === LayoutEnum.TOP" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
import { LayoutEnum } from "@/enums/LayoutEnum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarLogo = computed(() => settingsStore.sidebarLogo);
const layout = computed(() => settingsStore.layout);
</script>

<style lang="scss" scoped>
.has-logo,
.sidebar-content--vertical {
  background: var(--app-sidebar-bg);
}

.sidebar-content--vertical {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .sidebar-menu-scrollbar {
    flex: 1;
    min-height: 0;
  }

  :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
  }
}

:deep(.el-scrollbar__view) {
  min-height: 100%;
}
</style>
