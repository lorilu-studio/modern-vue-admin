<template>
  <div class="result-state" :class="`result-state--${status}`" role="status">
    <span class="result-state__icon">
      <AppIcon :name="content.icon" :size="38" />
    </span>
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
    <div v-if="$slots.actions" class="result-state__actions">
      <slot name="actions"></slot>
    </div>
    <div v-if="$slots.extra" class="result-state__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";

const props = defineProps<{
  status: "success" | "error" | "processing" | "forbidden";
  title: string;
  description?: string;
}>();
const states = {
  success: { icon: "circle-check" },
  error: { icon: "circle-x" },
  processing: { icon: "clock" },
  forbidden: { icon: "lock" },
};
const content = computed(() => states[props.status]);
</script>

<style scoped lang="scss">
.result-state {
  --result-color: var(--app-info);
  --result-bg: var(--app-info-soft);

  display: grid;
  justify-items: center;
  min-height: 480px;
  padding: 88px 24px;
  text-align: center;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.result-state--success {
  --result-color: var(--app-success);
  --result-bg: var(--app-success-soft);
}

.result-state--error,
.result-state--forbidden {
  --result-color: var(--app-danger);
  --result-bg: var(--app-danger-soft);
}

.result-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  margin-bottom: 22px;
  color: var(--result-color);
  background: var(--result-bg);
  border-radius: 22px;

  :deep(svg) {
    width: 38px;
    height: 38px;
  }
}

.result-state h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.result-state p {
  max-width: 560px;
  margin: 0;
  line-height: 22px;
  color: var(--app-text-secondary);
}

.result-state__actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.result-state__extra {
  width: min(680px, 100%);
  margin-top: 28px;
}
</style>
