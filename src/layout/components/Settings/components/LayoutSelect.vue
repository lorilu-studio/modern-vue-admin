<template>
  <div class="layout-selector" aria-label="导航布局">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="layout-option"
      :class="[
        `layout-option--${option.value}`,
        { 'is-active': modelValue === option.value },
      ]"
      :aria-pressed="modelValue === option.value"
      @click="updateValue(option.value)"
    >
      <span class="layout-preview">
        <i></i>
        <b></b>
      </span>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { LayoutEnum } from "@/enums/LayoutEnum";

defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const options = [
  { label: "左侧", value: LayoutEnum.LEFT },
  { label: "顶部", value: LayoutEnum.TOP },
  { label: "混合", value: LayoutEnum.MIX },
];

function updateValue(layout: string) {
  emit("update:modelValue", layout);
}
</script>

<style scoped lang="scss">
.layout-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.layout-option {
  display: grid;
  gap: 8px;
  padding: 8px;
  font-size: 12px;
  color: var(--app-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-control);

  &:hover,
  &.is-active {
    color: var(--app-primary);
    border-color: var(--app-primary);
  }
}

.layout-preview {
  position: relative;
  height: 44px;
  overflow: hidden;
  background: var(--app-bg-page);
  border-radius: 5px;

  i,
  b {
    position: absolute;
    display: block;
    background: var(--app-border-color-strong);
  }
}

.layout-option--left .layout-preview {
  i {
    inset: 0 auto 0 0;
    width: 26%;
  }

  b {
    inset: 0 0 auto 26%;
    height: 24%;
  }
}

.layout-option--top .layout-preview {
  i {
    inset: 0 0 auto;
    height: 26%;
  }

  b {
    display: none;
  }
}

.layout-option--mix .layout-preview {
  i {
    inset: 0 0 auto;
    height: 24%;
  }

  b {
    inset: 24% auto 0 0;
    width: 26%;
  }
}

.layout-option.is-active .layout-preview i,
.layout-option.is-active .layout-preview b {
  background: var(--app-primary);
}
</style>
