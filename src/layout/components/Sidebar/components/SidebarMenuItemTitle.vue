<template>
  <AppIcon class="menu-icon" :name="icon || 'menu'" :size="18" />
  <!-- 菜单标题 -->
  <span v-if="title" class="menu-title">{{ translateRouteTitle(title) }}</span>
</template>

<script setup lang="ts">
import { translateRouteTitle } from "@/utils/i18n";
import AppIcon from "@/components/AppIcon/index.vue";

defineProps({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.menu-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
