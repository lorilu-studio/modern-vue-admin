<template>
  <section class="search-panel" :class="{ 'is-expanded': expanded }">
    <div class="search-fields"><slot></slot></div>
    <div class="search-actions">
      <slot name="actions">
        <el-button @click="emit('reset')">重置</el-button>
        <el-button type="primary" @click="emit('search')">查询</el-button>
      </slot>
      <el-button
        v-if="collapsible"
        link
        type="primary"
        @click="expanded = !expanded"
      >
        {{ expanded ? "收起" : "展开" }}
        <AppIcon :name="expanded ? 'arrow-up' : 'arrow-down'" />
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";

const props = withDefaults(
  defineProps<{ collapsible?: boolean; defaultExpanded?: boolean }>(),
  { collapsible: true, defaultExpanded: false }
);
const emit = defineEmits<{ search: []; reset: [] }>();
const expanded = ref(props.defaultExpanded);
</script>

<style scoped lang="scss">
.search-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 18px 20px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.search-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px 16px;
  max-height: 32px;
  overflow: hidden;
  transition: max-height var(--app-motion-base);
}

.is-expanded .search-fields {
  max-height: 320px;
}

.search-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media (width < 1200px) {
  .search-fields {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (width < 768px) {
  .search-panel,
  .search-fields {
    grid-template-columns: 1fr;
  }

  .search-fields {
    max-height: 104px;
  }

  .is-expanded .search-fields {
    max-height: 520px;
  }

  .search-actions {
    justify-content: flex-end;
  }
}
</style>
