<template>
  <div class="tags-container">
    <el-scrollbar
      class="scroll-container"
      :vertical="false"
      @wheel.prevent="handleScroll"
    >
      <router-link
        ref="tagRef"
        v-for="tag in visitedViews"
        :key="tag.fullPath"
        :class="'tags-item ' + (tagsViewStore.isActive(tag) ? 'active' : '')"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openContentMenu(tag, $event)"
      >
        {{ translateRouteTitle(tag.title) }}
        <AppIcon
          class="close-icon"
          name="close"
          :size="12"
          v-if="!isAffix(tag)"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </el-scrollbar>

    <!-- tag标签操作菜单 -->
    <ul
      v-show="contentMenuVisible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <AppIcon name="refresh" />
        刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <AppIcon name="close" />
        关闭
      </li>
      <li @click="closeOtherTags">
        <AppIcon name="close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <AppIcon name="close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <AppIcon name="close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <AppIcon name="close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import { resolve } from "path-browserify";
import { translateRouteTitle } from "@/utils/i18n";
import AppIcon from "@/components/AppIcon/index.vue";

import {
  usePermissionStore,
  useTagsViewStore,
  useSettingsStore,
  useAppStore,
} from "@/store";

const { proxy } = getCurrentInstance()!;
const router = useRouter();
const route = useRoute();

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();
const appStore = useAppStore();

const { visitedViews } = storeToRefs(tagsViewStore);
const settingsStore = useSettingsStore();
const layout = computed(() => settingsStore.layout);

const selectedTag = ref<TagView>({
  path: "",
  fullPath: "",
  name: "",
  title: "",
  affix: false,
  keepAlive: false,
});

const affixTags = ref<TagView[]>([]);
const left = ref(0);
const top = ref(0);

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    immediate: true, //初始化立即执行
  }
);

const contentMenuVisible = ref(false); // 右键菜单是否显示
watch(contentMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeContentMenu);
  } else {
    document.body.removeEventListener("click", closeContentMenu);
  }
});

/**
 * 过滤出需要固定的标签
 */
function filterAffixTags(routes: RouteRecordRaw[], basePath = "/") {
  let tags: TagView[] = [];
  routes.forEach((route: RouteRecordRaw) => {
    const tagPath = resolve(basePath, route.path);
    if (route.meta?.affix) {
      tags.push({
        path: tagPath,
        fullPath: tagPath,
        name: String(route.name),
        title: route.meta?.title || "no-name",
        affix: route.meta?.affix,
        keepAlive: route.meta?.keepAlive,
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, basePath + route.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
}

function initTags() {
  const tags: TagView[] = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView({
      name: route.name as string,
      title: route.meta.title,
      path: route.path,
      fullPath: route.fullPath,
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive,
      query: route.query,
    });
  }
}

function moveToCurrentTag() {
  // 使用 nextTick() 的目的是确保在更新 tagsView 组件之前，scrollPaneRef 对象已经滚动到了正确的位置。
  nextTick(() => {
    for (const tag of visitedViews.value) {
      if (tag.path === route.path) {
        // when query is different then update
        // route.query = { ...route.query, ...tag.query };
        if (tag.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView({
            name: route.name as string,
            title: route.meta.title || "",
            path: route.path,
            fullPath: route.fullPath,
            affix: route.meta?.affix,
            keepAlive: route.meta?.keepAlive,
            query: route.query,
          });
        }
      }
    }
  });
}

function isAffix(tag: TagView) {
  return tag?.affix;
}

function isFirstView() {
  try {
    return (
      selectedTag.value.path === "/dashboard" ||
      selectedTag.value.fullPath === tagsViewStore.visitedViews[1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function isLastView() {
  try {
    return (
      selectedTag.value.fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  const { fullPath } = view;
  nextTick(() => {
    router.replace("/redirect" + fullPath);
  });
}

function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view).then((res: any) => {
    if (tagsViewStore.isActive(view)) {
      tagsViewStore.toLastView(res.visitedViews, view);
    }
  });
}

function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res: any) => {
    if (!res.visitedViews.find((item: any) => item.path === route.path)) {
      tagsViewStore.toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res: any) => {
    if (!res.visitedViews.find((item: any) => item.path === route.path)) {
      tagsViewStore.toLastView(res.visitedViews);
    }
  });
}

function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllViews().then((res: any) => {
    tagsViewStore.toLastView(res.visitedViews, view);
  });
}

/**
 * 打开右键菜单
 */
function openContentMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;

  const rect = proxy?.$el.getBoundingClientRect();
  const offsetLeft = rect?.left || 0;
  const offsetWidth = proxy?.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft + 15; // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }

  top.value = e.clientY - (rect?.top || 0) + 4;

  contentMenuVisible.value = true;
  selectedTag.value = tag;
}

/**
 * 关闭右键菜单
 */
function closeContentMenu() {
  contentMenuVisible.value = false;
}

/**
 * 滚动事件
 */
function handleScroll() {
  closeContentMenu();
}

function findOutermostParent(tree: any[], findName: string) {
  let parentMap: any = {};

  function buildParentMap(node: any, parent: any) {
    parentMap[node.name] = parent;

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        buildParentMap(node.children[i], node);
      }
    }
  }

  for (let i = 0; i < tree.length; i++) {
    buildParentMap(tree[i], null);
  }

  let currentNode = parentMap[findName];
  while (currentNode) {
    if (!parentMap[currentNode.name]) {
      return currentNode;
    }
    currentNode = parentMap[currentNode.name];
  }

  return null;
}

const againActiveTop = (newVal: string) => {
  if (layout.value !== "mix") return;
  const parent = findOutermostParent(permissionStore.routes, newVal);
  if (parent?.path && appStore.activeTopMenuPath !== parent.path) {
    appStore.activeTopMenu(parent.path);
  }
};
// 如果是混合模式，更改selectedTag，需要对应高亮的activeTop
watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      againActiveTop(newVal as string);
    }
  },
  {
    deep: true,
  }
);
onMounted(() => {
  initTags();
});
</script>

<style lang="scss" scoped>
.tags-container {
  position: relative;
  width: 100%;
  height: $tags-view-height;
  background-color: var(--app-tags-bg);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--app-border-color);
  border-bottom: 1px solid var(--app-border-color);

  .tags-item {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    height: 28px;
    padding: 0 9px;
    margin: 4px 0 0 4px;
    font-size: 12px;
    line-height: 20px;
    color: var(--app-text-secondary);
    cursor: pointer;
    border: 1px solid var(--app-border-color);
    border-radius: 6px;
    transition:
      color var(--app-motion-fast),
      border-color var(--app-motion-fast),
      background-color var(--app-motion-fast);

    &:hover {
      color: var(--app-text-primary);
      background: var(--app-bg-hover);
      border-color: var(--app-border-color-strong);
    }

    &:first-of-type {
      margin-left: 10px;
    }

    &:last-of-type {
      margin-right: 10px;
    }

    .close-icon {
      box-sizing: content-box;
      padding: 2px;
      color: var(--app-text-placeholder);
      border-radius: 4px;

      &:hover {
        color: var(--app-primary);
        background-color: var(--app-primary-soft);
      }
    }

    &.active {
      font-weight: 500;
      color: var(--app-primary);
      background-color: var(--app-primary-soft);
      border-color: transparent;

      .close-icon:hover {
        color: var(--app-primary);
        background-color: var(--app-bg-surface);
      }
    }
  }
}

.contextmenu {
  position: absolute;
  z-index: 99;
  overflow: hidden;
  font-size: 12px;
  color: var(--app-text-secondary);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-control);
  box-shadow: var(--app-shadow-popup);

  li {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 132px;
    height: 36px;
    padding: 0 12px;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      color: var(--app-text-primary);
      background: var(--app-bg-hover);
    }
  }
}

.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: $tags-view-height;
  }
}

@media (width < 768px) {
  .tags-container {
    display: none;
  }
}
</style>
