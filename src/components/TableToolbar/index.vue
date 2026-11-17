<template>
  <div class="table-toolbar">
    <div class="table-toolbar__heading">
      <strong v-if="title">{{ title }}</strong>
      <span v-if="selectedCount">已选择 {{ selectedCount }} 项</span>
    </div>
    <div class="table-toolbar__actions">
      <slot name="actions"></slot>
      <slot name="tools"></slot>
      <el-tooltip content="刷新" placement="top">
        <el-button
          circle
          :loading="loading"
          aria-label="刷新列表"
          @click="emit('refresh')"
        >
          <AppIcon name="refresh" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";

withDefaults(
  defineProps<{ title?: string; selectedCount?: number; loading?: boolean }>(),
  { title: "", selectedCount: 0, loading: false }
);
const emit = defineEmits<{ refresh: [] }>();
</script>

<style scoped lang="scss">
.table-toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
}

.table-toolbar__heading,
.table-toolbar__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.table-toolbar__heading strong {
  font-size: 16px;
}

.table-toolbar__heading span {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.table-toolbar__actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (width < 768px) {
  .table-toolbar {
    align-items: flex-start;
  }

  .table-toolbar__actions {
    max-width: 70%;
  }
}
</style>
