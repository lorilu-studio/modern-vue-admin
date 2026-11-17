<template>
  <button
    type="button"
    class="hamburger-button"
    :aria-label="isActive ? '折叠侧边栏' : '展开侧边栏'"
    @click="toggleClick"
  >
    <AppIcon
      class="hamburger"
      :class="{ 'is-active': isActive }"
      name="collapse"
    />
  </button>
</template>
<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";

defineProps({
  isActive: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggleClick"]);

function toggleClick() {
  emit("toggleClick");
}
</script>

<style scoped lang="scss">
.hamburger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  color: var(--app-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--app-radius-control);
  transition:
    color var(--app-motion-fast),
    background-color var(--app-motion-fast);

  &:hover {
    color: var(--app-text-primary);
    background: var(--app-bg-hover);
  }
}

.hamburger {
  vertical-align: middle;
  transition: transform var(--app-motion-base);
  transform: scaleX(-1);
}

.hamburger.is-active {
  transform: scaleX(1);
}
</style>
