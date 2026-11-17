<template>
  <div class="resource-page">
    <PageContainer
      title="菜单与资源权限"
      description="以页面资源和操作范围定义角色可访问的后台能力。"
    >
      <template #actions>
        <el-button type="primary" @click="showDetail(resources[0])">
          <AppIcon name="lock" />
          查看授权说明
        </el-button>
      </template>

      <SearchPanel @reset="reset" @search="search">
        <el-input
          v-model="query.keyword"
          clearable
          placeholder="搜索资源名称或路径"
        />
        <el-select v-model="query.type" clearable placeholder="全部类型">
          <el-option label="页面菜单" value="menu" />
          <el-option label="页面操作" value="action" />
        </el-select>
        <el-select v-model="query.status" clearable placeholder="全部状态">
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
      </SearchPanel>

      <section class="table-card">
        <TableToolbar title="资源清单" :loading="loading" @refresh="refresh" />
        <el-table :data="filteredResources" row-key="id">
          <el-table-column prop="name" label="资源名称" min-width="180" />
          <el-table-column label="类型" width="120">
            <template #default="{ row }">
              <el-tag
                :type="row.type === 'menu' ? 'primary' : 'info'"
                effect="plain"
              >
                {{ row.type === "menu" ? "页面菜单" : "页面操作" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="identifier"
            label="路由 / 权限标识"
            min-width="240"
          />
          <el-table-column prop="scope" label="授权范围" min-width="180" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <StatusTag
                dot
                :label="row.status === 'enabled' ? '启用' : '停用'"
                :type="row.status === 'enabled' ? 'success' : 'neutral'"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="136" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button
                  link
                  type="primary"
                  @click="showDetail(asResource(row))"
                >
                  查看
                </el-button>
                <el-button
                  v-hasPerm="['sys:menu:edit']"
                  link
                  type="primary"
                  @click="toggleStatus(asResource(row))"
                >
                  {{ row.status === "enabled" ? "停用" : "启用" }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </PageContainer>

    <el-dialog
      v-model="dialogVisible"
      title="资源详情"
      width="580px"
      align-center
    >
      <template v-if="selectedResource">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="资源名称">
            {{ selectedResource.name }}
          </el-descriptions-item>
          <el-descriptions-item label="资源类型">
            {{ selectedResource.type === "menu" ? "页面菜单" : "页面操作" }}
          </el-descriptions-item>
          <el-descriptions-item label="路由 / 标识">
            {{ selectedResource.identifier }}
          </el-descriptions-item>
          <el-descriptions-item label="授权范围">
            {{ selectedResource.scope }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ selectedResource.status === "enabled" ? "启用" : "停用" }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";
import PageContainer from "@/components/PageContainer/index.vue";
import SearchPanel from "@/components/SearchPanel/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";
import TableToolbar from "@/components/TableToolbar/index.vue";

defineOptions({ name: "ResourceManagement" });

interface Resource {
  id: number;
  name: string;
  type: "menu" | "action";
  identifier: string;
  scope: string;
  status: "enabled" | "disabled";
}
const resources = ref<Resource[]>([
  {
    id: 1,
    name: "用户管理",
    type: "menu",
    identifier: "/access/users",
    scope: "查看、新增、编辑、停用用户",
    status: "enabled",
  },
  {
    id: 2,
    name: "组织与部门",
    type: "menu",
    identifier: "/access/departments",
    scope: "查看和维护组织架构",
    status: "enabled",
  },
  {
    id: 3,
    name: "角色管理",
    type: "menu",
    identifier: "/access/roles",
    scope: "查看和分配角色权限",
    status: "enabled",
  },
  {
    id: 4,
    name: "操作日志",
    type: "menu",
    identifier: "/audit/operations",
    scope: "查看敏感操作记录",
    status: "enabled",
  },
  {
    id: 5,
    name: "删除用户",
    type: "action",
    identifier: "sys:user:delete",
    scope: "删除用户账号",
    status: "enabled",
  },
  {
    id: 6,
    name: "导出用户",
    type: "action",
    identifier: "sys:user:export",
    scope: "导出用户资料",
    status: "disabled",
  },
]);
const loading = ref(false);
const dialogVisible = ref(false);
const selectedResource = ref<Resource | null>(null);
const query = reactive({ keyword: "", type: "", status: "" });
const appliedQuery = reactive({ ...query });
const filteredResources = computed(() => {
  const keyword = appliedQuery.keyword.trim().toLowerCase();
  return resources.value.filter(
    (resource) =>
      (!keyword ||
        `${resource.name}${resource.identifier}`
          .toLowerCase()
          .includes(keyword)) &&
      (!appliedQuery.type || resource.type === appliedQuery.type) &&
      (!appliedQuery.status || resource.status === appliedQuery.status)
  );
});
function search() {
  Object.assign(appliedQuery, query);
}
function reset() {
  Object.assign(query, { keyword: "", type: "", status: "" });
  search();
}
function refresh() {
  loading.value = true;
  window.setTimeout(() => (loading.value = false), 400);
}
function asResource(row: unknown) {
  return row as Resource;
}
function showDetail(resource: Resource) {
  selectedResource.value = resource;
  dialogVisible.value = true;
}
function toggleStatus(resource: Resource) {
  resource.status = resource.status === "enabled" ? "disabled" : "enabled";
  ElMessage.success(`资源已${resource.status === "enabled" ? "启用" : "停用"}`);
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

.table-actions {
  display: flex;
  gap: 12px;
  white-space: nowrap;
}

.table-actions :deep(.el-button) {
  margin: 0;
}

@media (width < 768px) {
  .table-card {
    padding: 14px;
    overflow-x: auto;
  }
}
</style>
