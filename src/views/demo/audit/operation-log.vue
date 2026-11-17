<template>
  <PageContainer
    title="操作日志"
    description="追溯敏感数据、权限和配置的变更记录。"
  >
    <SearchPanel @reset="reset" @search="search">
      <el-input
        v-model="query.keyword"
        clearable
        placeholder="搜索操作人、对象或操作内容"
      />
      <el-select v-model="query.module" clearable placeholder="全部模块">
        <el-option label="用户管理" value="用户管理" />
        <el-option label="角色管理" value="角色管理" />
        <el-option label="资源权限" value="资源权限" />
      </el-select>
      <el-date-picker
        v-model="query.range"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </SearchPanel>
    <section class="table-card">
      <TableToolbar title="操作记录" :loading="loading" @refresh="refresh" />
      <el-table :data="filteredLogs">
        <el-table-column prop="time" label="操作时间" width="170" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="module" label="模块" width="130" />
        <el-table-column prop="action" label="操作内容" min-width="260" />
        <el-table-column prop="target" label="操作对象" min-width="180" />
        <el-table-column prop="ip" label="IP 地址" width="140" />
        <el-table-column label="结果" width="100">
          <template #default>
            <StatusTag dot label="成功" type="success" />
          </template>
        </el-table-column>
      </el-table>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import SearchPanel from "@/components/SearchPanel/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";
import TableToolbar from "@/components/TableToolbar/index.vue";
import { isInDateRange } from "@/utils/list-data";
defineOptions({ name: "OperationLog" });
const logs = [
  {
    time: "2026-09-26 10:24",
    operator: "林澈",
    module: "角色管理",
    action: "更新角色权限范围",
    target: "系统管理员",
    ip: "192.168.1.20",
  },
  {
    time: "2026-09-26 09:42",
    operator: "陈屿",
    module: "用户管理",
    action: "停用用户账号",
    target: "周宁",
    ip: "192.168.1.31",
  },
  {
    time: "2026-09-25 16:18",
    operator: "林澈",
    module: "资源权限",
    action: "启用页面资源",
    target: "操作日志",
    ip: "192.168.1.20",
  },
  {
    time: "2026-09-25 14:06",
    operator: "苏禾",
    module: "用户管理",
    action: "更新用户所属部门",
    target: "陈屿",
    ip: "192.168.1.42",
  },
];
const loading = ref(false);
const query = reactive({ keyword: "", module: "", range: [] as string[] });
const appliedQuery = reactive({ ...query });
const filteredLogs = computed(() => {
  const keyword = appliedQuery.keyword.trim();
  return logs.filter(
    (log) =>
      (!keyword || Object.values(log).join("").includes(keyword)) &&
      (!appliedQuery.module || log.module === appliedQuery.module) &&
      isInDateRange(log.time, appliedQuery.range)
  );
});
function search() {
  Object.assign(appliedQuery, query);
}
function reset() {
  Object.assign(query, { keyword: "", module: "", range: [] });
  search();
}
function refresh() {
  loading.value = true;
  window.setTimeout(() => (loading.value = false), 400);
}
</script>

<style scoped lang="scss">
.table-card {
  display: grid;
  gap: 16px;
  padding: 18px 20px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

@media (width < 768px) {
  .table-card {
    padding: 14px;
    overflow-x: auto;
  }
}
</style>
