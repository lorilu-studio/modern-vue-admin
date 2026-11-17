<template>
  <el-color-picker
    v-model="currentColor"
    :predefine="colorPresets"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const colorPresets = [
  "#315EFB",
  "#0F8B8D",
  "#7C5CFC",
  "#B54708",
  "#C11574",
  "#344054",
];

const currentColor = ref(props.modelValue);

watch(currentColor, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped>
:deep(.theme-picker-dropdown) {
  z-index: 99999 !important;
}
</style>
