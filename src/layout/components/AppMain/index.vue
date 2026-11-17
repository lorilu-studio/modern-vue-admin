<template>
  <section
    class="app-main"
    :class="`app-main--${settingsStore.contentWidth}`"
    :style="{ minHeight: minHeight }"
  >
    <router-view>
      <template #default="{ Component, route }">
        <KeepAlive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </template>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { useSettingsStore, useTagsViewStore } from "@/store";
import variables from "@/styles/variables.module.scss";

const { cachedViews } = storeToRefs(useTagsViewStore());
const settingsStore = useSettingsStore();

const minHeight = computed(() => {
  if (settingsStore.tagsView) {
    return `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})`;
  } else {
    return `calc(100vh - ${variables["navbar-height"]})`;
  }
});
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  margin: 0 auto;
  background-color: var(--el-bg-color-page);
  transition: background-color var(--app-motion-base);
}

.app-main--default {
  max-width: 1200px;
}

.app-main--wide {
  max-width: 1440px;
}
</style>
