<template>
  <PageContainer
    title="登录日志"
    description="查看账号登录活动，及时发现异常设备和失败尝试。"
  >
    <SearchPanel @reset="reset" @search="search">
      <el-input
        v-model="query.keyword"
        clearable
        placeholder="搜索账号、姓名或 IP 地址"
      />
      <el-select v-model="query.result" clearable placeholder="全部结果">
        <el-option label="成功" value="成功" />
        <el-option label="失败" value="失败" />
      </el-select>
    </SearchPanel>
    <section class="table-card">
      <TableToolbar title="登录记录" :loading="loading" @refresh="refresh" />
      <el-table :data="filteredLogs">
        <el-table-column prop="time" label="登录时间" width="170" />
        <el-table-column prop="user" label="账号" min-width="150" />
        <el-table-column prop="ip" label="IP 地址" width="150" />
        <el-table-column prop="device" label="设备与浏览器" min-width="210" />
        <el-table-column prop="location" label="登录地点" min-width="150" />
        <el-table-column label="结果" width="110">
          <template #default="{ row }">
            <StatusTag
              dot
              :label="row.result"
              :type="row.result === '成功' ? 'success' : 'danger'"
            />
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
defineOptions({ name: "LoginLog" });
const logs = [
  {
    time: "2026-09-26 10:12",
    user: "linche / 林澈",
    ip: "192.168.1.20",
    device: "macOS · Chrome 140",
    location: "台北",
    result: "成功",
  },
  {
    time: "2026-09-26 09:46",
    user: "chenyu / 陈屿",
    ip: "192.168.1.31",
    device: "Windows · Edge 140",
    location: "上海",
    result: "成功",
  },
  {
    time: "2026-09-25 23:18",
    user: "zhouning / 周宁",
    ip: "203.0.113.8",
    device: "未知设备",
    location: "未知",
    result: "失败",
  },
];
const loading = ref(false);
const query = reactive({ keyword: "", result: "" });
const appliedQuery = reactive({ ...query });
const filteredLogs = computed(() => {
  const keyword = appliedQuery.keyword.trim();
  return logs.filter(
    (log) =>
      (!keyword || Object.values(log).join("").includes(keyword)) &&
      (!appliedQuery.result || log.result === appliedQuery.result)
  );
});
function search() {
  Object.assign(appliedQuery, query);
}
function reset() {
  Object.assign(query, { keyword: "", result: "" });
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
