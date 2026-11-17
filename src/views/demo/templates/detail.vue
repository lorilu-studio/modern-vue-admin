<template>
  <PageContainer
    title="项目详情"
    description="复杂对象详情页示例：集中展示基本信息、成员与关键变更。"
  >
    <template #actions>
      <el-button @click="router.push('/templates/list')">返回列表</el-button>
      <el-button type="primary" @click="router.push('/templates/basic-form')">
        编辑项目
      </el-button>
    </template>

    <section class="detail-hero">
      <div class="detail-identity">
        <span class="detail-mark">成</span>
        <div>
          <p class="eyebrow">PRJ-2026-018</p>
          <h2>成员中心迭代</h2>
          <p>统一成员资料、组织归属和访问角色的管理流程。</p>
        </div>
      </div>
      <StatusTag dot label="进行中" type="info" />
    </section>

    <section class="detail-grid">
      <article class="detail-card overview-card">
        <div class="card-heading">
          <h3>基本信息</h3>
          <span>最后更新于 2026-09-26 14:32</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="项目负责人">林澈</el-descriptions-item>
          <el-descriptions-item label="所属团队">
            平台研发部
          </el-descriptions-item>
          <el-descriptions-item label="开始日期">
            2026-09-01
          </el-descriptions-item>
          <el-descriptions-item label="计划完成">
            2026-10-18
          </el-descriptions-item>
          <el-descriptions-item label="项目说明" :span="2">
            统一成员资料、组织归属和访问角色的管理流程，降低跨部门协作中的权限维护成本。
          </el-descriptions-item>
        </el-descriptions>
        <div class="member-block">
          <h3>协作成员</h3>
          <div class="member-list">
            <span
              v-for="member in members"
              :key="member.name"
              class="member-chip"
            >
              <i>{{ member.name.slice(0, 1) }}</i>
              {{ member.name }}
              <small>{{ member.role }}</small>
            </span>
          </div>
        </div>
      </article>

      <article class="detail-card activity-card">
        <div class="card-heading">
          <h3>项目动态</h3>
          <span>最近 30 天</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="activity in activities"
            :key="activity.time"
            :timestamp="activity.time"
            :type="activity.type"
          >
            <strong>{{ activity.title }}</strong>
            <p>{{ activity.description }}</p>
          </el-timeline-item>
        </el-timeline>
      </article>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";

defineOptions({ name: "DetailTemplate" });

const router = useRouter();
const members = [
  { name: "林澈", role: "负责人" },
  { name: "陈屿", role: "产品协作" },
  { name: "周宁", role: "业务验收" },
];
const activities = [
  {
    time: "09-26 14:32",
    title: "更新了角色分配方案",
    description: "林澈调整了项目协作者的访问范围。",
    type: "primary" as const,
  },
  {
    time: "09-22 10:15",
    title: "完成需求评审",
    description: "陈屿确认了成员资料与组织字段。",
    type: "success" as const,
  },
  {
    time: "09-01 09:00",
    title: "项目已创建",
    description: "项目进入进行中状态。",
    type: "info" as const,
  },
];
</script>

<style scoped lang="scss">
.detail-hero,
.detail-card {
  padding: 22px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.detail-hero,
.detail-identity {
  display: flex;
  gap: 16px;
  align-items: center;
}

.detail-hero {
  justify-content: space-between;
}

.detail-mark {
  display: grid;
  flex: 0 0 52px;
  place-items: center;
  width: 52px;
  height: 52px;
  font-size: 20px;
  font-weight: 600;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 14px;
}

.eyebrow,
.detail-identity h2,
.detail-identity p {
  margin: 0;
}

.eyebrow {
  margin-bottom: 5px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.detail-identity h2 {
  font-size: 20px;
}

.detail-identity h2 + p {
  margin-top: 5px;
  color: var(--app-text-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  gap: 16px;
}

.card-heading {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  span {
    font-size: 12px;
    color: var(--app-text-secondary);
  }
}

.member-block {
  padding-top: 22px;
  margin-top: 22px;
  border-top: 1px solid var(--app-border-color);

  h3 {
    margin: 0 0 14px;
    font-size: 16px;
  }
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.member-chip {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 6px 10px 6px 6px;
  background: var(--app-bg-hover);
  border-radius: 999px;

  i {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    font-style: normal;
    color: var(--app-primary);
    background: var(--app-primary-soft);
    border-radius: 50%;
  }

  small {
    color: var(--app-text-secondary);
  }
}

.activity-card :deep(.el-timeline-item__content) {
  color: var(--app-text-primary);
}

.activity-card :deep(.el-timeline-item__content p) {
  margin: 5px 0 0;
  line-height: 22px;
  color: var(--app-text-secondary);
}

@media (width < 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (width < 640px) {
  .detail-hero,
  .detail-card {
    padding: 16px;
  }

  .detail-hero {
    align-items: flex-start;
  }

  .detail-identity {
    align-items: flex-start;
  }
}
</style>
