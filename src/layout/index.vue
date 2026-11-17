<template>
  <div class="layout-shell wh-full" :class="classObj">
    <!-- 遮罩层 -->
    <div
      v-if="isMobile && isOpenSidebar"
      class="mobile-mask wh-full fixed-lt"
      @click="handleOutsideClick"
    ></div>

    <!-- 公用侧边栏 -->
    <Sidebar class="sidebar-container" />

    <!-- 混合布局 -->
    <div v-if="layout === LayoutEnum.MIX" class="mix-container">
      <div class="mix-container__left">
        <SidebarMenu :menu-list="mixLeftMenus" :base-path="activeTopMenuPath" />
        <div class="sidebar-toggle">
          <hamburger
            :is-active="appStore.sidebar.opened"
            @toggle-click="toggleSidebar"
          />
        </div>
      </div>

      <div :class="{ hasTagsView: showTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <TagsView v-if="showTagsView" />
        </div>
        <AppMain />
        <Settings v-if="defaultSettings.showSettings" />
        <!-- 返回顶部 -->
        <el-backtop target=".main-container">
          <AppIcon name="backtop" :size="24" />
        </el-backtop>
      </div>
    </div>

    <!-- 左侧和顶部布局 -->
    <div v-else :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <NavBar v-if="layout === LayoutEnum.LEFT" />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMain />
      <Settings v-if="defaultSettings.showSettings" />
      <!-- 返回顶部 -->
      <el-backtop target=".main-container">
        <AppIcon name="backtop" :size="24" />
      </el-backtop>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { LayoutEnum } from "@/enums/LayoutEnum";
import AppIcon from "@/components/AppIcon/index.vue";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const width = useWindowSize().width;

const WIDTH_DESKTOP = 992; // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）
const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);
const isOpenSidebar = computed(() => appStore.sidebar.opened);
const fixedHeader = computed(() => settingsStore.fixedHeader); // 是否固定header
const showTagsView = computed(() => settingsStore.tagsView); // 是否显示tagsView
const layout = computed(() => settingsStore.layout); // 布局模式 left top mix
const activeTopMenuPath = computed(() => appStore.activeTopMenuPath); // 顶部菜单激活path
const mixLeftMenus = computed(() => permissionStore.mixLeftMenus); // 混合布局左侧菜单

watch(
  () => activeTopMenuPath.value,
  (newVal) => {
    permissionStore.setMixLeftMenus(newVal);
  },
  {
    deep: true,
    immediate: true,
  }
);

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === DeviceEnum.MOBILE,
  [`layout-${settingsStore.layout}`]: true,
  [`content-width-${settingsStore.contentWidth}`]: true,
}));

watchEffect(() => {
  appStore.toggleDevice(
    width.value < WIDTH_DESKTOP ? DeviceEnum.MOBILE : DeviceEnum.DESKTOP
  );
  if (width.value >= WIDTH_DESKTOP) {
    appStore.openSideBar();
  } else {
    appStore.closeSideBar();
  }
});

function handleOutsideClick() {
  appStore.closeSideBar();
}

function toggleSidebar() {
  appStore.toggleSidebar();
}

const route = useRoute();
watch(route, () => {
  if (isMobile.value && isOpenSidebar.value) {
    appStore.closeSideBar();
  }
});
</script>

<style lang="scss" scoped>
.layout-shell {
  --app-content-max-width: 100%;

  &.content-width-default {
    --app-content-max-width: 1200px;
  }

  &.content-width-wide {
    --app-content-max-width: 1440px;
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  background-color: $menu-background;
  border-right: 1px solid var(--app-border-color);
  transition:
    width var(--app-motion-base),
    transform var(--app-motion-base);

  :deep(.el-menu) {
    border: none;
  }
}

.main-container {
  position: relative;
  height: 100%;
  margin-left: $sidebar-width;
  overflow-y: auto;
  background: var(--app-bg-page);
  transition: margin-left var(--app-motion-base);

  .fixed-header {
    position: sticky;
    top: 0;
    z-index: 9;
    background: var(--app-navbar-bg);
    backdrop-filter: blur(16px);
    box-shadow: inset 0 -1px var(--app-border-color);
    transition: width var(--app-motion-base);
  }
}

.mobile-mask {
  z-index: 998;
  background: var(--app-mask);
  backdrop-filter: blur(2px);
}

.layout-top {
  .sidebar-container {
    position: sticky;
    z-index: 999;
    display: flex;
    width: 100% !important;
    height: $navbar-height;
    padding-inline: max(0px, calc((100% - var(--app-content-max-width)) / 2));
    border-right: 0;
    border-bottom: 1px solid var(--app-border-color);

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-scrollbar__bar) {
      display: none;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--collapse) {
      width: 100%;
    }
  }

  .main-container {
    height: calc(100vh - $navbar-height);
    margin-left: 0;
  }
}

.layout-mix {
  .sidebar-container {
    width: 100% !important;
    height: $navbar-height;
    border-right: 0;
    border-bottom: 1px solid var(--app-border-color);

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--horizontal.el-menu) {
      border: none;
    }
  }

  .mix-container {
    display: flex;
    height: 100%;
    padding-top: $navbar-height;

    .mix-container__left {
      position: relative;
      width: $sidebar-width;
      height: 100%;
      background: var(--app-sidebar-bg);
      border-right: 1px solid var(--app-border-color);
      transition: width var(--app-motion-base);

      :deep(.el-menu) {
        height: 100%;
        border: none;
      }

      .sidebar-toggle {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 48px;
        line-height: 48px;
        background: var(--app-sidebar-bg);
        border-top: 1px solid var(--app-border-color);

        div:hover {
          background-color: var(--app-sidebar-hover-bg);
        }

        :deep(svg) {
          color: var(--app-primary) !important;
        }
      }
    }

    .main-container {
      flex: 1;
      min-width: 0;
      margin-left: 0;
    }
  }
}

.hideSidebar {
  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.layout-top {
    .main-container {
      margin-left: 0;
    }
  }

  &.layout-mix {
    .sidebar-container {
      width: 100% !important;
    }

    .mix-container {
      .mix-container__left {
        width: $sidebar-width-collapsed;
      }
    }
  }
}

.layout-left.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.mobile {
    .sidebar-container {
      pointer-events: none;
      transform: translate3d(-100%, 0, 0);
    }

    .main-container {
      margin-left: 0;
    }
  }
}

.mobile {
  .sidebar-container {
    box-shadow: var(--app-shadow-dialog);
  }

  .main-container {
    margin-left: 0;
  }

  &.layout-top {
    // 顶部模式全局变量修改
    --el-menu-item-height: #{$navbar-height};
  }
}

@media (width < 768px) {
  .main-container .fixed-header {
    backdrop-filter: none;
  }
}
</style>
