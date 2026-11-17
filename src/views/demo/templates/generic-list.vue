<template>
  <PageContainer
    title="项目列表"
    description="通用资源列表示例，展示筛选、批量选择与详情入口。"
  >
    <template #actions>
      <el-button type="primary" @click="router.push('/templates/basic-form')">
        <AppIcon name="plus" />
        新建项目
      </el-button>
    </template>

    <SearchPanel @search="search" @reset="reset">
      <el-input
        v-model="query.keyword"
        clearable
        placeholder="搜索项目名称或负责人"
      />
      <el-select v-model="query.status" clearable placeholder="全部状态">
        <el-option label="进行中" value="active" />
        <el-option label="已完成" value="completed" />
        <el-option label="待启动" value="pending" />
      </el-select>
    </SearchPanel>

    <section class="list-card">
      <TableToolbar
        title="项目清单"
        :selected-count="selectedRows.length"
        @refresh="refresh"
      >
        <template #actions>
          <el-button v-if="selectedRows.length" @click="archiveSelected">
            归档所选
          </el-button>
        </template>
      </TableToolbar>

      <el-table
        v-if="filteredRows.length"
        :data="filteredRows"
        row-key="id"
        @selection-change="selectedRows = $event"
      >
        <el-table-column type="selection" width="44" />
        <el-table-column label="项目" min-width="200">
          <template #default="{ row }">
            <div class="project-cell">
              <span class="project-mark">{{ row.name.slice(0, 1) }}</span>
              <span>
                <strong>{{ row.name }}</strong>
                <small>{{ row.code }}</small>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="108" />
        <el-table-column prop="team" label="所属团队" min-width="130" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <StatusTag dot :label="row.statusLabel" :type="row.statusTone" />
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="最近更新" width="152" />
        <el-table-column label="操作" width="108" fixed="right">
          <template #default>
            <el-button
              link
              type="primary"
              @click="router.push('/templates/detail')"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <EmptyState v-else type="search">
        <template #actions>
          <el-button @click="reset">清空筛选</el-button>
        </template>
      </EmptyState>

      <div class="list-footer">
        <span>共 {{ filteredRows.length }} 个项目</span>
        <el-pagination
          layout="prev, pager, next"
          :total="filteredRows.length"
          :page-size="10"
        />
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";
import EmptyState from "@/components/EmptyState/index.vue";
import PageContainer from "@/components/PageContainer/index.vue";
import SearchPanel from "@/components/SearchPanel/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";
import TableToolbar from "@/components/TableToolbar/index.vue";

defineOptions({ name: "GenericListTemplate" });

type ProjectStatus = "active" | "completed" | "pending";
interface ProjectRow {
  id: number;
  name: string;
  code: string;
  owner: string;
  team: string;
  status: ProjectStatus;
  statusLabel: string;
  statusTone: "success" | "info" | "warning";
  updatedAt: string;
}

const router = useRouter();
const query = reactive({ keyword: "", status: "" });
const appliedQuery = reactive({ ...query });
const selectedRows = ref<ProjectRow[]>([]);
const rows: ProjectRow[] = [
  {
    id: 1,
    name: "成员中心迭代",
    code: "PRJ-2026-018",
    owner: "林澈",
    team: "平台研发部",
    status: "active",
    statusLabel: "进行中",
    statusTone: "info",
    updatedAt: "2026-09-26 14:32",
  },
  {
    id: 2,
    name: "数据报表升级",
    code: "PRJ-2026-015",
    owner: "陈屿",
    team: "客户成功部",
    status: "completed",
    statusLabel: "已完成",
    statusTone: "success",
    updatedAt: "2026-09-25 11:08",
  },
  {
    id: 3,
    name: "移动端体验优化",
    code: "PRJ-2026-021",
    owner: "周宁",
    team: "市场运营部",
    status: "pending",
    statusLabel: "待启动",
    statusTone: "warning",
    updatedAt: "2026-09-24 09:21",
  },
];
const filteredRows = computed(() => {
  const keyword = appliedQuery.keyword.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!keyword ||
        `${row.name}${row.owner}${row.code}`.toLowerCase().includes(keyword)) &&
      (!appliedQuery.status || row.status === appliedQuery.status)
  );
});

function search() {
  Object.assign(appliedQuery, query);
}
function reset() {
  Object.assign(query, { keyword: "", status: "" });
  search();
}
function refresh() {
  ElMessage.success("列表已刷新（演示）");
}
function archiveSelected() {
  ElMessage.info(
    `已选择 ${selectedRows.value.length} 个项目；批量归档仅为交互示例`
  );
}
</script>

<style scoped lang="scss">
.list-card {
  display: grid;
  gap: 12px;
  padding: 20px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.project-cell {
  display: flex;
  gap: 12px;
  align-items: center;

  strong,
  small {
    display: block;
  }

  small {
    margin-top: 4px;
    font-size: 12px;
    color: var(--app-text-secondary);
  }
}

.project-mark {
  display: grid;
  flex: 0 0 36px;
  place-items: center;
  width: 36px;
  height: 36px;
  font-weight: 600;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 10px;
}

.list-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

@media (width < 768px) {
  .list-card {
    padding: 14px;
  }

  .list-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
