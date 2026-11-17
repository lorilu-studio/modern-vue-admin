<template>
  <main
    class="page-container"
    :class="`page-container--${width}`"
    :aria-busy="loading"
  >
    <header
      v-if="title || description || $slots.actions || $slots.extra"
      class="page-header"
    >
      <div class="page-heading">
        <h1 v-if="title">{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
        <slot name="extra"></slot>
      </div>
      <div v-if="$slots.actions" class="page-actions">
        <slot name="actions"></slot>
      </div>
    </header>

    <el-skeleton v-if="loading" :rows="6" animated class="page-loading" />
    <div v-else class="page-content"><slot></slot></div>
  </main>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    loading?: boolean;
    width?: "default" | "wide" | "full";
  }>(),
  { title: "", description: "", loading: false, width: "full" }
);
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  min-height: 100%;
  padding: var(--app-space-page);
  margin: 0 auto;
}

.page-container--default {
  max-width: 1200px;
}

.page-container--wide {
  max-width: 1440px;
}

.page-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-heading h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 650;
  line-height: 32px;
  color: var(--app-text-primary);
  letter-spacing: -0.02em;
}

.page-heading p {
  max-width: 720px;
  margin: 5px 0 0;
  line-height: 22px;
  color: var(--app-text-secondary);
}

.page-actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.page-content {
  display: grid;
  gap: 16px;
}

.page-loading {
  padding: 24px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

@media (width < 768px) {
  .page-header {
    display: grid;
    gap: 14px;
  }

  .page-heading h1 {
    font-size: 21px;
    line-height: 28px;
  }

  .page-actions {
    justify-content: flex-start;
  }
}
</style>
