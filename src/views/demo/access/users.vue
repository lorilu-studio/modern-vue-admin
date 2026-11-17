<template>
  <div class="user-management-page">
    <PageContainer
      title="用户管理"
      description="管理成员账号、角色与使用状态。"
    >
      <template #actions>
        <el-button
          v-hasPerm="['sys:user:add']"
          type="primary"
          @click="openCreateDialog"
        >
          <AppIcon name="plus" />
          新增用户
        </el-button>
      </template>

      <SearchPanel @search="search" @reset="reset">
        <el-input
          v-model="query.keyword"
          clearable
          placeholder="搜索姓名或账号"
        />
        <el-select v-model="query.status" clearable placeholder="全部状态">
          <el-option label="正常" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-select v-model="query.role" clearable placeholder="全部角色">
          <el-option
            v-for="role in roleOptions"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
        <el-date-picker
          v-model="query.range"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </SearchPanel>

      <section class="table-card">
        <TableToolbar
          title="用户列表"
          :selected-count="selectedRows.length"
          :loading="loading"
          @refresh="refresh"
        >
          <template #actions>
            <el-button
              v-if="selectedRows.length"
              v-hasPerm="['sys:user:edit']"
              plain
              type="danger"
              @click="disableSelected"
            >
              批量停用
            </el-button>
          </template>
        </TableToolbar>

        <el-table
          v-if="filteredRows.length"
          v-loading="loading"
          :data="pagedRows"
          row-key="id"
          @selection-change="selectedRows = $event"
        >
          <el-table-column type="selection" width="48" />
          <el-table-column label="用户" min-width="220">
            <template #default="scope">
              <div class="user-cell">
                <span class="user-avatar">
                  {{ scope.row.name.slice(0, 1) }}
                </span>
                <span>
                  <strong>{{ scope.row.name }}</strong>
                  <small>{{ scope.row.email }}</small>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="roleLabel" label="角色" width="120" />
          <el-table-column prop="department" label="部门" min-width="150" />
          <el-table-column prop="lastActive" label="最近活跃" width="170" />
          <el-table-column label="状态" width="110">
            <template #default="scope">
              <StatusTag
                dot
                :label="scope.row.status === 'enabled' ? '正常' : '停用'"
                :type="scope.row.status === 'enabled' ? 'success' : 'neutral'"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="184" fixed="right">
            <template #default="scope">
              <div class="table-actions">
                <el-button
                  v-hasPerm="['sys:user:query']"
                  link
                  type="primary"
                  @click="openDetailDialog(asUser(scope.row))"
                >
                  查看
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  link
                  type="primary"
                  @click="openEditDialog(asUser(scope.row))"
                >
                  编辑
                </el-button>
                <el-dropdown trigger="click">
                  <el-button link type="primary">
                    更多
                    <AppIcon name="arrow-down" :size="14" />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-hasPerm="['sys:user:edit']"
                        @click="toggleStatus(asUser(scope.row))"
                      >
                        {{
                          scope.row.status === "enabled"
                            ? "停用账号"
                            : "启用账号"
                        }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        v-hasPerm="['sys:user:delete']"
                        @click="removeUser(asUser(scope.row))"
                      >
                        删除用户
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <EmptyState v-else type="search">
          <template #actions>
            <el-button @click="reset">清空筛选</el-button>
          </template>
        </EmptyState>
        <div class="pagination-row">
          <span>共 {{ filteredRows.length }} 条</span>
          <el-pagination
            v-model:current-page="currentPage"
            layout="prev, pager, next"
            :total="filteredRows.length"
            :page-size="pageSize"
          />
        </div>
      </section>
    </PageContainer>

    <el-dialog
      v-model="detailVisible"
      class="user-dialog"
      title="用户详情"
      width="760px"
      align-center
      @closed="selectedUser = null"
    >
      <template v-if="selectedUser">
        <div class="dialog-profile">
          <span class="dialog-profile__avatar">
            {{ selectedUser.name.slice(0, 1) }}
          </span>
          <div>
            <h2>{{ selectedUser.name }}</h2>
            <p>{{ selectedUser.roleLabel }} · {{ selectedUser.department }}</p>
          </div>
          <StatusTag
            dot
            :label="selectedUser.status === 'enabled' ? '正常' : '停用'"
            :type="selectedUser.status === 'enabled' ? 'success' : 'neutral'"
          />
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="登录账号">
            {{ selectedUser.username }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ selectedUser.email }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ selectedUser.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ selectedUser.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="最近登录">
            {{ selectedUser.lastActive }}
          </el-descriptions-item>
          <el-descriptions-item label="所属部门">
            {{ selectedUser.department }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="hasAuth('sys:user:edit')"
          type="primary"
          @click="editFromDetail"
        >
          编辑资料
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="formVisible"
      class="user-dialog"
      :title="editingUser ? '编辑用户' : '新增用户'"
      width="840px"
      align-center
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <section class="dialog-section">
          <div class="dialog-section__heading">
            <h2>基本信息</h2>
            <p>用于识别成员和发送系统通知。</p>
          </div>
          <div class="dialog-form-grid">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="输入成员姓名" />
            </el-form-item>
            <el-form-item label="登录账号" prop="username">
              <el-input v-model="form.username" placeholder="输入登录账号" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="name@example.com" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="输入手机号" />
            </el-form-item>
          </div>
        </section>
        <section class="dialog-section">
          <div class="dialog-section__heading">
            <h2>组织与权限</h2>
            <p>角色决定成员可以访问的菜单和操作。</p>
          </div>
          <div class="dialog-form-grid">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="form.department" placeholder="选择部门">
                <el-option
                  v-for="department in departments"
                  :key="department"
                  :label="department"
                  :value="department"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="form.role" placeholder="选择角色">
                <el-option
                  v-for="role in roleOptions"
                  :key="role.value"
                  :label="role.label"
                  :value="role.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态">
              <el-switch
                v-model="form.enabled"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </div>
        </section>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveUser">
          保存用户
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import AppIcon from "@/components/AppIcon/index.vue";
import EmptyState from "@/components/EmptyState/index.vue";
import PageContainer from "@/components/PageContainer/index.vue";
import SearchPanel from "@/components/SearchPanel/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";
import TableToolbar from "@/components/TableToolbar/index.vue";
import { isInDateRange, paginate } from "@/utils/list-data";
import { hasAuth } from "@/plugins/permission";

defineOptions({ name: "UserManagement" });

type UserStatus = "enabled" | "disabled";
interface UserRow {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  roleLabel: string;
  department: string;
  status: UserStatus;
  createdAt: string;
  lastActive: string;
}

const roleOptions = [
  { value: "admin", label: "管理员" },
  { value: "operator", label: "运营" },
  { value: "viewer", label: "访客" },
];
const departments = ["平台研发部", "客户成功部", "财务中心", "市场运营部"];
const roleLabels = Object.fromEntries(
  roleOptions.map((role) => [role.value, role.label])
);
const loading = ref(false);
const saving = ref(false);
const selectedRows = ref<UserRow[]>([]);
const selectedUser = ref<UserRow | null>(null);
const editingUser = ref<UserRow | null>(null);
const detailVisible = ref(false);
const formVisible = ref(false);
const formRef = ref<FormInstance>();
const currentPage = ref(1);
const pageSize = 10;
const query = reactive({
  keyword: "",
  status: "",
  role: "",
  range: [] as string[],
});
const appliedQuery = reactive({ ...query });
const form = reactive({
  name: "",
  username: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  enabled: true,
});
const rules: FormRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  username: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
  email: [
    {
      required: true,
      type: "email",
      message: "请输入有效邮箱",
      trigger: "blur",
    },
  ],
  department: [
    { required: true, message: "请选择所属部门", trigger: "change" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};
const rows = ref<UserRow[]>([
  {
    id: 1,
    name: "林澈",
    username: "linche",
    email: "lin@example.com",
    phone: "138 0000 0000",
    role: "admin",
    roleLabel: "管理员",
    department: "平台研发部",
    status: "enabled",
    createdAt: "2026-06-18 10:24",
    lastActive: "2026-09-14 14:32",
  },
  {
    id: 2,
    name: "陈屿",
    username: "chenyu",
    email: "chen@example.com",
    phone: "139 0000 0000",
    role: "operator",
    roleLabel: "运营",
    department: "客户成功部",
    status: "enabled",
    createdAt: "2026-07-04 09:18",
    lastActive: "2026-09-14 11:08",
  },
  {
    id: 3,
    name: "周宁",
    username: "zhouning",
    email: "zhou@example.com",
    phone: "136 0000 0000",
    role: "viewer",
    roleLabel: "访客",
    department: "财务中心",
    status: "disabled",
    createdAt: "2026-05-21 16:40",
    lastActive: "2026-09-10 09:21",
  },
  {
    id: 4,
    name: "苏禾",
    username: "suhe",
    email: "su@example.com",
    phone: "137 0000 0000",
    role: "operator",
    roleLabel: "运营",
    department: "市场运营部",
    status: "enabled",
    createdAt: "2026-08-08 13:52",
    lastActive: "2026-09-13 18:46",
  },
]);

const filteredRows = computed(() => {
  const keyword = appliedQuery.keyword.trim().toLowerCase();
  return rows.value.filter((row) => {
    const matchesKeyword =
      !keyword ||
      `${row.name}${row.username}${row.email}`.toLowerCase().includes(keyword);
    return (
      matchesKeyword &&
      (!appliedQuery.status || row.status === appliedQuery.status) &&
      (!appliedQuery.role || row.role === appliedQuery.role) &&
      isInDateRange(row.lastActive, appliedQuery.range)
    );
  });
});
const pagedRows = computed(() =>
  paginate(filteredRows.value, currentPage.value, pageSize)
);

function search() {
  Object.assign(appliedQuery, query);
  currentPage.value = 1;
}
function reset() {
  Object.assign(query, { keyword: "", status: "", role: "", range: [] });
  search();
}
function refresh() {
  loading.value = true;
  window.setTimeout(() => (loading.value = false), 500);
}
function resetForm() {
  editingUser.value = null;
  Object.assign(form, {
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    enabled: true,
  });
  formRef.value?.clearValidate();
}
function asUser(row: unknown) {
  return row as UserRow;
}
function openCreateDialog() {
  if (!hasAuth("sys:user:add")) return;
  resetForm();
  formVisible.value = true;
}
function openEditDialog(user: UserRow) {
  if (!hasAuth("sys:user:edit")) return;
  editingUser.value = user;
  Object.assign(form, {
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    department: user.department,
    role: user.role,
    enabled: user.status === "enabled",
  });
  formVisible.value = true;
}
function openDetailDialog(user: UserRow) {
  selectedUser.value = user;
  detailVisible.value = true;
}
function editFromDetail() {
  if (!selectedUser.value) return;
  const user = selectedUser.value;
  detailVisible.value = false;
  openEditDialog(user);
}

async function saveUser() {
  if (!hasAuth(editingUser.value ? "sys:user:edit" : "sys:user:add")) return;
  if (!(await formRef.value?.validate().catch(() => false))) return;
  saving.value = true;
  window.setTimeout(() => {
    const roleLabel = roleLabels[form.role] || form.role;
    if (editingUser.value) {
      Object.assign(editingUser.value, {
        ...form,
        roleLabel,
        status: form.enabled ? "enabled" : "disabled",
        lastActive: "刚刚更新",
      });
      ElMessage.success("用户资料已更新");
    } else {
      rows.value.unshift({
        id: Math.max(0, ...rows.value.map((user) => user.id)) + 1,
        ...form,
        roleLabel,
        status: form.enabled ? "enabled" : "disabled",
        createdAt: "刚刚创建",
        lastActive: "尚未登录",
      });
      ElMessage.success("用户已创建");
    }
    saving.value = false;
    formVisible.value = false;
  }, 400);
}

async function confirmAction(
  message: string,
  title: string,
  confirmButtonText: string
) {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText,
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => true)
    .catch(() => false);
}
async function toggleStatus(user: UserRow) {
  if (!hasAuth("sys:user:edit")) return;
  const enabled = user.status !== "enabled";
  if (
    !(await confirmAction(
      `确定${enabled ? "启用" : "停用"}“${user.name}”吗？`,
      `${enabled ? "启用" : "停用"}账号`,
      "确认"
    ))
  )
    return;
  user.status = enabled ? "enabled" : "disabled";
  ElMessage.success(`用户已${enabled ? "启用" : "停用"}`);
}
async function disableSelected() {
  if (!hasAuth("sys:user:edit")) return;
  const enabledUsers = selectedRows.value.filter(
    (user) => user.status === "enabled"
  );
  if (
    !enabledUsers.length ||
    !(await confirmAction(
      `确定停用选中的 ${enabledUsers.length} 位用户吗？`,
      "批量停用",
      "确认停用"
    ))
  )
    return;
  enabledUsers.forEach((user) => (user.status = "disabled"));
  ElMessage.success("已停用选中用户");
}
async function removeUser(user: UserRow) {
  if (!hasAuth("sys:user:delete")) return;
  if (
    !(await confirmAction(
      `删除“${user.name}”后无法恢复，确定继续吗？`,
      "删除用户",
      "删除"
    ))
  )
    return;
  rows.value = rows.value.filter((item) => item.id !== user.id);
  selectedRows.value = selectedRows.value.filter((item) => item.id !== user.id);
  ElMessage.success("用户已删除");
}
</script>

<style scoped lang="scss">
.table-card {
  display: grid;
  gap: 16px;
  padding: 18px 20px 14px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.user-cell,
.user-cell > span {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-cell > span:last-child {
  display: grid;
  gap: 2px;
}

.user-cell small,
.dialog-profile p,
.dialog-section__heading p {
  color: var(--app-text-secondary);
}

.user-avatar,
.dialog-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--app-primary);
  background: var(--app-primary-soft);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.dialog-profile {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 22px;
}

.dialog-profile__avatar {
  width: 48px;
  height: 48px;
  font-size: 18px;
  border-radius: 12px;
}

.dialog-profile h2,
.dialog-profile p,
.dialog-section__heading h2,
.dialog-section__heading p {
  margin: 0;
}

.dialog-profile h2,
.dialog-section__heading h2 {
  font-size: 16px;
}

.dialog-profile p,
.dialog-section__heading p {
  margin-top: 4px;
}

.dialog-profile :deep(.status-tag) {
  margin-left: auto;
}

.dialog-section + .dialog-section {
  margin-top: 24px;
}

.dialog-section__heading {
  margin-bottom: 16px;
}

.dialog-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}

.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  white-space: nowrap;
}

.table-actions :deep(.el-button) {
  margin: 0;
}

.table-actions :deep(.el-dropdown) {
  display: inline-flex;
}

:global(.user-dialog) {
  display: flex;
  flex-direction: column;
  width: min(var(--el-dialog-width), calc(100% - 24px));
  max-height: calc(100vh - 48px);
}

:global(.user-dialog .el-dialog__body) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

@media (width < 768px) {
  .table-card {
    padding: 14px;
    overflow-x: auto;
  }

  .dialog-form-grid {
    grid-template-columns: 1fr;
  }

  .dialog-profile {
    align-items: flex-start;
  }
}
</style>
