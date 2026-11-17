<template>
  <div class="empty-state" role="status">
    <span class="empty-state__icon">
      <AppIcon :name="content.icon" :size="30" />
    </span>
    <h3>{{ title || content.title }}</h3>
    <p>{{ description || content.description }}</p>
    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";

const props = withDefaults(
  defineProps<{
    type?: "empty" | "search" | "error" | "forbidden";
    title?: string;
    description?: string;
  }>(),
  { type: "empty", title: "", description: "" }
);

const states = {
  empty: {
    icon: "empty",
    title: "暂无数据",
    description: "创建第一条内容后会显示在这里。",
  },
  search: {
    icon: "search",
    title: "没有匹配结果",
    description: "尝试调整关键词或清空筛选条件。",
  },
  error: {
    icon: "error",
    title: "加载失败",
    description: "检查网络连接后重试。",
  },
  forbidden: {
    icon: "lock",
    title: "暂无权限",
    description: "请联系管理员申请所需权限。",
  },
};
const content = computed(() => states[props.type]);
</script>

<style scoped lang="scss">
.empty-state {
  display: grid;
  justify-items: center;
  min-height: 280px;
  padding: 48px 20px;
  text-align: center;
}

.empty-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 18px;

  :deep(svg) {
    width: 30px;
    height: 30px;
  }
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.empty-state p {
  max-width: 420px;
  margin: 0;
  line-height: 22px;
  color: var(--app-text-secondary);
}

.empty-state__actions {
  margin-top: 18px;
}
</style>
