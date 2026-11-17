<template>
  <div class="navbar-actions">
    <template v-if="!isMobile">
      <lang-select class="nav-action-item" />

      <el-dropdown class="message" trigger="click">
        <button class="nav-action-item" type="button" aria-label="消息通知">
          <el-badge is-dot><AppIcon name="bell" /></el-badge>
        </button>
        <template #dropdown>
          <div class="message-panel">
            <div class="message-panel__header">
              <strong>消息中心</strong>
              <el-button link type="primary">全部已读</el-button>
            </div>
            <el-tabs v-model="activeTab">
              <el-tab-pane
                v-for="(label, key) in MessageTypeLabels"
                :key="key"
                :label="label"
                :name="key"
              >
                <button
                  v-for="message in getFilteredMessages(key)"
                  :key="message.id"
                  class="message-item"
                  type="button"
                >
                  <span class="message-dot"></span>
                  <span>{{ message.title }}</span>
                </button>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="changeTheme">
        <button
          class="nav-action-item"
          type="button"
          :aria-label="`主题：${themeLabel}`"
        >
          <AppIcon :name="settingStore.isDark ? 'moon' : 'sunny'" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :command="ThemeEnum.LIGHT"
              :disabled="settingStore.theme === ThemeEnum.LIGHT"
            >
              浅色模式
            </el-dropdown-item>
            <el-dropdown-item
              :command="ThemeEnum.DARK"
              :disabled="settingStore.theme === ThemeEnum.DARK"
            >
              深色模式
            </el-dropdown-item>
            <el-dropdown-item
              :command="ThemeEnum.AUTO"
              :disabled="settingStore.theme === ThemeEnum.AUTO"
            >
              跟随系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>

    <el-dropdown trigger="click">
      <button class="user-trigger" type="button" aria-label="用户菜单">
        <span class="user-avatar">
          {{ userInitial }}
        </span>
        <span class="user-name">{{ userStore.user.username || "管理员" }}</span>
        <AppIcon class="user-arrow" name="arrow-up" :size="14" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>
            {{ userStore.user.username || "管理员" }}
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-tooltip
      v-if="defaultSettings.showSettings"
      content="界面设置"
      placement="bottom"
    >
      <button
        class="nav-action-item"
        type="button"
        aria-label="打开界面设置"
        @click="settingStore.settingsVisible = true"
      >
        <AppIcon name="setting" />
      </button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import {
  useAppStore,
  useTagsViewStore,
  useUserStore,
  useSettingsStore,
} from "@/store";
import defaultSettings from "@/settings";
import AppIcon from "@/components/AppIcon/index.vue";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { MessageTypeEnum, MessageTypeLabels } from "@/enums/MessageTypeEnum";
import { ThemeEnum } from "@/enums/ThemeEnum";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingStore = useSettingsStore();
const route = useRoute();
const router = useRouter();
const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);
const activeTab = ref(MessageTypeEnum.MESSAGE);

const themeLabel = computed(() => {
  if (settingStore.theme === ThemeEnum.AUTO) return "跟随系统";
  return settingStore.isDark ? "深色" : "浅色";
});
const userInitial = computed(() =>
  (userStore.user.username || "A").slice(0, 1).toUpperCase()
);

const messages = ref([
  {
    id: 1,
    title: "系统维护将在今晚 00:00 开始，请提前保存工作。",
    type: MessageTypeEnum.MESSAGE,
  },
  { id: 2, title: "你有 3 项待处理审批。", type: MessageTypeEnum.NOTICE },
  { id: 3, title: "请完成本月权限复核。", type: MessageTypeEnum.TODO },
]);

function getFilteredMessages(type: MessageTypeEnum) {
  return messages.value.filter((message) => message.type === type);
}

function changeTheme(theme: string) {
  settingStore.changeTheme(theme);
}

function logout() {
  ElMessageBox.confirm("退出后需要重新登录，确定继续吗？", "退出登录", {
    confirmButtonText: "退出",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => tagsViewStore.delAllViews())
      .then(() => router.push(`/login?redirect=${route.fullPath}`));
  });
}
</script>

<style lang="scss" scoped>
.navbar-actions {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-action-item,
.user-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0;
  color: var(--app-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--app-radius-control);
  transition:
    color var(--app-motion-fast),
    background-color var(--app-motion-fast);

  &:hover {
    color: var(--app-text-primary);
    background: var(--app-bg-hover);
  }
}

.nav-action-item {
  width: 36px;
  margin: 0 2px;
}

:deep(.nav-action-item > div),
:deep(.nav-action-item .el-tooltip__trigger) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.user-trigger {
  gap: 8px;
  padding: 0 10px 0 6px;
  margin-left: 4px;
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  font-size: 12px;
  font-weight: 700;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 8px;
}

.user-arrow {
  width: 12px;
}

.message-panel {
  width: 360px;
  padding: 16px 18px 10px;
}

.message-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message-item {
  display: grid;
  grid-template-columns: 6px 1fr;
  gap: 10px;
  width: 100%;
  padding: 10px 0;
  line-height: 20px;
  color: var(--app-text-secondary);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.message-dot {
  width: 6px;
  height: 6px;
  margin-top: 7px;
  background: var(--app-primary);
  border-radius: 50%;
}

@media (width < 768px) {
  .user-name,
  .user-arrow {
    display: none;
  }

  .user-trigger {
    padding: 0 4px;
  }
}
</style>
