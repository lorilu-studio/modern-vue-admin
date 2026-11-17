<template>
  <PageContainer
    :title="`${greeting}，${displayName}`"
    :description="`${today} · 这是今天需要关注的业务概览。`"
  >
    <template #actions>
      <el-button @click="showExportHint">
        <AppIcon name="download" />
        导出周报
      </el-button>
      <el-button
        v-if="router.hasRoute('UserManagement')"
        type="primary"
        @click="router.push('/access/users')"
      >
        <AppIcon name="plus" />
        管理用户
      </el-button>
    </template>

    <section class="metric-grid" aria-label="核心指标">
      <article v-for="item in metrics" :key="item.label" class="metric-card">
        <span class="metric-card__icon" :class="`is-${item.tone}`">
          <AppIcon :name="item.icon" :size="22" />
        </span>
        <div>
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span :class="item.trend.startsWith('+') ? 'is-up' : ''">
            {{ item.trend }}
          </span>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card progress-card">
        <div class="section-heading">
          <div>
            <h2>本周处理进度</h2>
            <p>各业务模块的计划完成情况</p>
          </div>
          <el-button
            v-if="router.hasRoute('RoleManagement')"
            text
            @click="router.push('/access/roles')"
          >
            查看明细
            <AppIcon name="arrow-right" />
          </el-button>
        </div>
        <div class="progress-list">
          <div
            v-for="item in progressItems"
            :key="item.label"
            class="progress-item"
          >
            <div>
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}%</strong>
            </div>
            <el-progress
              :percentage="item.value"
              :show-text="false"
              :stroke-width="8"
            />
          </div>
        </div>
      </article>

      <article class="dashboard-card todo-card">
        <div class="section-heading">
          <div>
            <h2>待办事项</h2>
            <p>按优先级处理</p>
          </div>
          <el-badge :value="todos.length" />
        </div>
        <button
          v-for="todo in todos"
          :key="todo.title"
          type="button"
          class="todo-item"
          @click="router.push('/audit/operations')"
        >
          <span class="todo-item__dot" :class="`is-${todo.level}`"></span>
          <span>
            <strong>{{ todo.title }}</strong>
            <small>{{ todo.meta }}</small>
          </span>
          <AppIcon name="arrow-right" />
        </button>
      </article>
    </section>

    <section class="dashboard-grid dashboard-grid--bottom">
      <article class="dashboard-card activity-card">
        <div class="section-heading">
          <div>
            <h2>最新动态</h2>
            <p>团队近期的关键操作记录</p>
          </div>
          <el-button
            v-if="router.hasRoute('OperationLog')"
            text
            @click="router.push('/audit/operations')"
          >
            全部动态
          </el-button>
        </div>
        <div class="activity-list">
          <div
            v-for="activity in activities"
            :key="activity.title"
            class="activity-item"
          >
            <span class="activity-item__avatar">
              {{ activity.user.slice(0, 1) }}
            </span>
            <div>
              <p>
                <strong>{{ activity.user }}</strong>
                {{ activity.title }}
              </p>
              <small>{{ activity.time }}</small>
            </div>
            <StatusTag :label="activity.status" :type="activity.type" />
          </div>
        </div>
      </article>

      <article class="dashboard-card quick-card">
        <div class="section-heading">
          <div>
            <h2>快捷入口</h2>
            <p>常用管理功能</p>
          </div>
        </div>
        <div class="quick-grid">
          <button
            v-for="item in availableShortcuts"
            :key="item.label"
            type="button"
            @click="router.push(item.path)"
          >
            <AppIcon :name="item.icon" :size="20" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </article>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";
import PageContainer from "@/components/PageContainer/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";
import { useUserStore } from "@/store";

defineOptions({ name: "Dashboard" });

const router = useRouter();
const userStore = useUserStore();
const showExportHint = () => ElMessage.info("演示模板未接入报表导出接口");
const displayName = computed(
  () => userStore.user.nickname || userStore.user.username || "管理员"
);
const hour = new Date().getHours();
const greeting = hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
const today = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "long",
}).format(new Date());

const metrics = [
  {
    label: "今日访问",
    value: "8,642",
    trend: "+12.4%",
    tone: "primary",
    icon: "analytics",
  },
  {
    label: "待处理任务",
    value: "24",
    trend: "6 项紧急",
    tone: "warning",
    icon: "document",
  },
  {
    label: "活跃用户",
    value: "1,286",
    trend: "+8.7%",
    tone: "success",
    icon: "user",
  },
  {
    label: "本周日程",
    value: "18",
    trend: "下次 14:30",
    tone: "info",
    icon: "calendar",
  },
];
const progressItems = [
  { label: "用户中心迭代", value: 82 },
  { label: "数据报表升级", value: 68 },
  { label: "权限策略梳理", value: 54 },
  { label: "移动端体验优化", value: 36 },
];
const todos = [
  { title: "审核季度运营报告", meta: "今天 16:00 前", level: "danger" },
  { title: "确认新角色权限范围", meta: "来自平台研发部", level: "warning" },
  { title: "回复 3 条系统反馈", meta: "客户服务中心", level: "primary" },
];
const activities = [
  {
    user: "林澈",
    title: "发布了 9 月运营周报",
    time: "12 分钟前",
    status: "已发布",
    type: "success" as const,
  },
  {
    user: "周宁",
    title: "更新了用户权限策略",
    time: "1 小时前",
    status: "待复核",
    type: "warning" as const,
  },
  {
    user: "陈序",
    title: "完成数据报表验收",
    time: "昨天 18:24",
    status: "已完成",
    type: "info" as const,
  },
];
const shortcuts = [
  {
    label: "用户管理",
    path: "/access/users",
    icon: "user",
    route: "UserManagement",
  },
  {
    label: "角色管理",
    path: "/access/roles",
    icon: "lock",
    route: "RoleManagement",
  },
  {
    label: "操作日志",
    path: "/audit/operations",
    icon: "document",
    route: "OperationLog",
  },
  {
    label: "我的资料",
    path: "/profile/index",
    icon: "user-round",
    route: "ProfileCenter",
  },
];
const availableShortcuts = computed(() =>
  shortcuts.filter((item) => router.hasRoute(item.route))
);
</script>

<style scoped lang="scss">
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.metric-card,
.dashboard-card {
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.metric-card {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 20px;
}

.metric-card__icon {
  display: inline-flex;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 12px;
}

.metric-card__icon.is-success {
  color: var(--app-success);
  background: var(--app-success-soft);
}

.metric-card__icon.is-warning {
  color: var(--app-warning);
  background: var(--app-warning-soft);
}

.metric-card__icon.is-info {
  color: var(--app-info);
  background: var(--app-info-soft);
}

.metric-card__icon :deep(svg) {
  width: 21px;
  height: 21px;
}

.metric-card p {
  margin: 0 0 5px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.metric-card strong {
  margin-right: 8px;
  font-size: 24px;
  line-height: 30px;
  color: var(--app-text-primary);
}

.metric-card span {
  font-size: 12px;
  color: var(--app-text-placeholder);
  white-space: nowrap;
}

.metric-card span.is-up {
  color: var(--app-success);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.8fr);
  gap: 16px;
}

.dashboard-grid--bottom {
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.7fr);
}

.dashboard-card {
  min-width: 0;
  padding: 22px;
}

.section-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  font-size: 16px;
  color: var(--app-text-primary);
}

.section-heading p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.progress-list {
  display: grid;
  gap: 20px;
}

.progress-item > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.progress-item strong {
  font-variant-numeric: tabular-nums;
}

.todo-card {
  display: flex;
  flex-direction: column;
}

.todo-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 13px 0;
  color: var(--app-text-primary);
  text-align: left;
  cursor: pointer;
  background: none;
  border: 0;
  border-top: 1px solid var(--app-border-color);
}

.todo-item:hover strong {
  color: var(--app-primary);
}

.todo-item:focus-visible,
.quick-grid button:focus-visible {
  outline: none;
  box-shadow: var(--app-focus-ring);
}

.todo-item__dot {
  width: 8px;
  height: 8px;
  background: var(--app-primary);
  border-radius: 50%;
}

.todo-item__dot.is-danger {
  background: var(--app-danger);
}

.todo-item__dot.is-warning {
  background: var(--app-warning);
}

.todo-item span {
  display: grid;
  gap: 4px;
}

.todo-item small,
.activity-item small {
  color: var(--app-text-secondary);
}

.activity-list {
  display: grid;
}

.activity-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid var(--app-border-color);
}

.activity-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.activity-item__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-weight: 650;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 10px;
}

.activity-item p {
  margin: 0 0 4px;
  color: var(--app-text-secondary);
}

.activity-item p strong {
  color: var(--app-text-primary);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quick-grid button {
  display: grid;
  gap: 8px;
  place-items: center;
  min-height: 92px;
  color: var(--app-text-secondary);
  cursor: pointer;
  background: var(--app-bg-hover);
  border: 1px solid transparent;
  border-radius: 10px;
  transition:
    border-color var(--app-motion-fast),
    color var(--app-motion-fast);
}

.quick-grid button:hover {
  color: var(--app-primary);
  border-color: var(--app-border-color-strong);
}

.quick-grid :deep(svg) {
  width: 22px;
  height: 22px;
}

@media (width < 1100px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid,
  .dashboard-grid--bottom {
    grid-template-columns: 1fr;
  }
}

@media (width < 600px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-card {
    padding: 18px;
  }

  .activity-item {
    grid-template-columns: auto 1fr;
  }

  .activity-item > :last-child {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
