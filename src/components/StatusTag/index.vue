<template>
  <span class="status-tag" :class="`status-tag--${type}`">
    <i v-if="dot" aria-hidden="true"></i>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: "neutral" | "info" | "success" | "warning" | "danger";
    dot?: boolean;
  }>(),
  { type: "neutral", dot: false }
);
</script>

<style scoped lang="scss">
.status-tag {
  --status-color: var(--app-text-secondary);
  --status-bg: var(--app-bg-muted);

  display: inline-flex;
  gap: 6px;
  align-items: center;
  width: fit-content;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 550;
  line-height: 20px;
  color: var(--status-color);
  background: var(--status-bg);
  border-radius: 6px;

  i {
    width: 6px;
    height: 6px;
    background: currentcolor;
    border-radius: 50%;
  }
}

.status-tag--info {
  --status-color: var(--app-info);
  --status-bg: var(--app-info-soft);
}

.status-tag--success {
  --status-color: var(--app-success);
  --status-bg: var(--app-success-soft);
}

.status-tag--warning {
  --status-color: var(--app-warning);
  --status-bg: var(--app-warning-soft);
}

.status-tag--danger {
  --status-color: var(--app-danger);
  --status-bg: var(--app-danger-soft);
}
</style>
