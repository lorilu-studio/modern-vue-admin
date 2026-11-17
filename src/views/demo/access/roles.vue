<template>
  <div class="role-page">
    <PageContainer
      title="角色管理"
      description="角色定义成员可访问的资源与可执行的操作。"
    >
      <template #actions>
        <el-button
          v-hasPerm="['sys:role:add']"
          type="primary"
          @click="openCreate"
        >
          <AppIcon name="plus" />
          新增角色
        </el-button>
      </template>

      <SearchPanel @reset="reset" @search="search">
        <el-input
          v-model="query.keyword"
          clearable
          placeholder="搜索角色名称或编码"
        />
        <el-select v-model="query.status" clearable placeholder="全部状态">
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
      </SearchPanel>

      <section class="table-card">
        <TableToolbar title="角色列表" :loading="loading" @refresh="refresh" />
        <el-table :data="filteredRoles" row-key="id">
          <el-table-column prop="name" label="角色名称" min-width="150" />
          <el-table-column prop="code" label="角色编码" min-width="180" />
          <el-table-column
            prop="description"
            label="职责说明"
            min-width="240"
          />
          <el-table-column prop="userCount" label="成员数" width="100" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <StatusTag
                dot
                :label="row.status === 'enabled' ? '启用' : '停用'"
                :type="row.status === 'enabled' ? 'success' : 'neutral'"
              />
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="最近更新" width="170" />
          <el-table-column label="操作" width="132" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button
                  v-hasPerm="['sys:role:edit']"
                  link
                  type="primary"
                  @click="openEdit(asRole(row))"
                >
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['sys:role:edit']"
                  link
                  type="primary"
                  @click="toggleStatus(asRole(row))"
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
      :title="editingRole ? '编辑角色' : '新增角色'"
      width="680px"
      align-center
    >
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="角色名称" required>
            <el-input v-model="form.name" placeholder="例如：内容运营" />
          </el-form-item>
          <el-form-item label="角色编码" required>
            <el-input
              v-model="form.code"
              placeholder="例如：content_operator"
            />
          </el-form-item>
        </div>
        <el-form-item label="职责说明">
          <el-input v-model="form.description" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="资源权限">
          <el-checkbox-group v-model="form.permissions" class="permission-grid">
            <el-checkbox v-for="item in permissions" :key="item" :label="item">
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-switch
            v-model="form.enabled"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存角色</el-button>
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

defineOptions({ name: "RoleManagement" });

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  status: "enabled" | "disabled";
  updatedAt: string;
  permissions: string[];
}

const permissions = [
  "用户管理",
  "组织与部门",
  "角色管理",
  "资源权限",
  "操作日志",
  "登录日志",
];
const roles = ref<Role[]>([
  {
    id: 1,
    name: "系统管理员",
    code: "system_admin",
    description: "维护成员、角色和资源权限。",
    userCount: 2,
    status: "enabled",
    updatedAt: "2026-09-15 16:20",
    permissions: permissions.slice(),
  },
  {
    id: 2,
    name: "运营人员",
    code: "operator",
    description: "处理日常业务数据和运营任务。",
    userCount: 8,
    status: "enabled",
    updatedAt: "2026-09-12 10:32",
    permissions: ["用户管理", "操作日志"],
  },
  {
    id: 3,
    name: "只读访客",
    code: "viewer",
    description: "仅查看被授权的业务信息。",
    userCount: 14,
    status: "enabled",
    updatedAt: "2026-09-08 14:05",
    permissions: [],
  },
]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingRole = ref<Role | null>(null);
const query = reactive({ keyword: "", status: "" });
const appliedQuery = reactive({ ...query });
const form = reactive({
  name: "",
  code: "",
  description: "",
  permissions: [] as string[],
  enabled: true,
});
const filteredRoles = computed(() => {
  const keyword = appliedQuery.keyword.trim().toLowerCase();
  return roles.value.filter(
    (role) =>
      (!keyword ||
        `${role.name}${role.code}`.toLowerCase().includes(keyword)) &&
      (!appliedQuery.status || role.status === appliedQuery.status)
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
  loading.value = true;
  window.setTimeout(() => (loading.value = false), 400);
}
function asRole(row: unknown) {
  return row as Role;
}
function openCreate() {
  editingRole.value = null;
  Object.assign(form, {
    name: "",
    code: "",
    description: "",
    permissions: [],
    enabled: true,
  });
  dialogVisible.value = true;
}
function openEdit(role: Role) {
  editingRole.value = role;
  Object.assign(form, {
    ...role,
    permissions: [...role.permissions],
    enabled: role.status === "enabled",
  });
  dialogVisible.value = true;
}
function saveRole() {
  if (!form.name.trim() || !form.code.trim()) {
    ElMessage.warning("请填写角色名称和编码");
    return;
  }
  if (editingRole.value) {
    Object.assign(editingRole.value, {
      ...form,
      status: form.enabled ? "enabled" : "disabled",
      updatedAt: "刚刚更新",
    });
    ElMessage.success("角色已更新");
  } else {
    roles.value.unshift({
      id: Date.now(),
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim() || "暂未填写职责说明。",
      permissions: [...form.permissions],
      userCount: 0,
      status: form.enabled ? "enabled" : "disabled",
      updatedAt: "刚刚创建",
    });
    ElMessage.success("角色已创建");
  }
  dialogVisible.value = false;
}
function toggleStatus(role: Role) {
  role.status = role.status === "enabled" ? "disabled" : "enabled";
  role.updatedAt = "刚刚更新";
  ElMessage.success(`角色已${role.status === "enabled" ? "启用" : "停用"}`);
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (width < 768px) {
  .table-card {
    padding: 14px;
    overflow-x: auto;
  }

  .form-grid,
  .permission-grid {
    grid-template-columns: 1fr;
  }
}
</style>
