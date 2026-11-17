<template>
  <div class="logo-container">
    <transition name="logo-title">
      <router-link class="logo-link" to="/" :key="+collapse">
        <span class="logo-mark">
          <img :src="modernVueAdminMark" class="logo-image" alt="" />
        </span>
        <span v-if="!collapse" class="logo-copy">
          <span class="logo-title">{{ defaultSettings.title }}</span>
          <small class="logo-version">v{{ defaultSettings.version }}</small>
        </span>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import modernVueAdminMark from "@/assets/modern-vue-admin-mark.svg";
import defaultSettings from "@/settings";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .logo-link {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
  }

  .logo-mark {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--app-primary-soft);
    border-radius: 10px;
  }

  .logo-image {
    width: 22px;
    height: 22px;
  }

  .logo-copy {
    display: grid;
    min-width: 0;
    margin-left: 10px;
  }

  .logo-title {
    flex-shrink: 0; /* 防止容器在空间不足时缩小 */
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 650;
    color: var(--app-sidebar-text-strong);
    white-space: nowrap;
  }

  .logo-version {
    margin-top: 1px;
    font-size: 10px;
    font-weight: 600;
    line-height: 12px;
    color: var(--app-text-tertiary);
    letter-spacing: 0.04em;
  }
}

.logo-title-enter-active,
.logo-title-leave-active {
  transition: opacity var(--app-motion-fast);
}

.logo-title-enter-from,
.logo-title-leave-to {
  opacity: 0;
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;

      .logo-link {
        justify-content: center;
        padding: 0;
      }
    }
  }
}
</style>
