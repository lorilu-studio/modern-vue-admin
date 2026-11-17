<template>
  <component
    :is="icon"
    class="app-icon"
    :size="size"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpToLine,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  CircleX,
  Clock3,
  Download,
  FileText,
  Languages,
  LayoutDashboard,
  Link,
  LockKeyhole,
  Maximize,
  Menu,
  Minimize,
  Moon,
  Network,
  PackageOpen,
  PanelLeftClose,
  Plus,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  Table2,
  TriangleAlert,
  User,
  Users,
  X,
} from "@lucide/vue";

const props = withDefaults(
  defineProps<{ name: string; size?: string | number; strokeWidth?: number }>(),
  { size: 16, strokeWidth: 1.75 }
);

const icons: Record<string, Component> = {
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  backtop: ArrowUpToLine,
  bell: Bell,
  calendar: CalendarDays,
  "circle-check": CircleCheck,
  "circle-x": CircleX,
  close: X,
  close_all: X,
  close_left: X,
  close_other: X,
  close_right: X,
  collapse: PanelLeftClose,
  document: FileText,
  download: Download,
  fullscreen: Maximize,
  "fullscreen-exit": Minimize,
  homepage: LayoutDashboard,
  language: Languages,
  "el-icon-Link": Link,
  link: Link,
  lock: LockKeyhole,
  menu: Menu,
  moon: Moon,
  nested: Network,
  plus: Plus,
  refresh: RotateCw,
  search: Search,
  setting: Settings,
  size: SlidersHorizontal,
  sunny: Sun,
  table: Table2,
  user: Users,
  "user-round": User,
  cascader: Network,
  analytics: ChartNoAxesCombined,
  check: CheckCircle2,
  clock: Clock3,
  empty: PackageOpen,
  error: TriangleAlert,
};

const icon = computed(() => icons[props.name] || icons.menu);
</script>

<style scoped>
.app-icon {
  display: block;
  flex: 0 0 auto;
}
</style>
