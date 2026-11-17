<template>
  <div class="navbar-container">
    <hamburger
      :is-active="appStore.sidebar.opened"
      @toggle-click="toggleSideBar"
    />
    <!-- 导航栏右侧 -->
    <NavbarAction />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

const appStore = useAppStore();

function toggleSideBar() {
  appStore.toggleSidebar();
}
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply flex-x-between;

  height: $navbar-height;
  padding-right: 10px;
  background: var(--app-navbar-bg);
  backdrop-filter: blur(16px);
}

@media (width < 768px) {
  .navbar-container {
    padding-right: 4px;
  }
}
</style>
