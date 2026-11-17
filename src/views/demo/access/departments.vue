<template>
  <div class="department-page">
    <PageContainer
      title="组织与部门"
      description="通过组织归属统一管理员工、负责人和角色分配。"
    >
      <template #actions>
        <el-button
          v-hasPerm="['sys:dept:add']"
          type="primary"
          @click="dialogVisible = true"
        >
          <AppIcon name="plus" />
          新增部门
        </el-button>
      </template>

      <section class="department-layout">
        <article class="tree-card">
          <div class="card-heading">
            <div>
              <h2>组织架构</h2>
              <p>选择部门查看负责人和成员范围。</p>
            </div>
            <el-tag effect="plain">{{ departmentCount }} 个部门</el-tag>
          </div>
          <el-tree
            :data="departments"
            :expand-on-click-node="false"
            default-expand-all
            highlight-current
            node-key="id"
            @node-click="selectedDepartment = $event"
          >
            <template #default="{ data }">
              <span class="tree-node">
                <AppIcon name="nested" :size="15" />
                <span>{{ data.label }}</span>
                <small>{{ data.memberCount }} 人</small>
              </span>
            </template>
          </el-tree>
        </article>

        <article v-if="selectedDepartment" class="detail-card">
          <div class="card-heading">
            <div>
              <p class="eyebrow">部门信息</p>
              <h2>{{ selectedDepartment.label }}</h2>
            </div>
            <StatusTag dot :label="selectedDepartment.status" type="success" />
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="部门负责人">
              {{ selectedDepartment.manager }}
            </el-descriptions-item>
            <el-descriptions-item label="成员数量">
              {{ selectedDepartment.memberCount }} 人
            </el-descriptions-item>
            <el-descriptions-item label="部门说明">
              {{ selectedDepartment.description }}
            </el-descriptions-item>
          </el-descriptions>
          <div class="member-section">
            <div class="card-heading">
              <div>
                <h3>部门成员</h3>
                <p>成员的业务权限由角色决定。</p>
              </div>
              <el-button text type="primary">管理成员</el-button>
            </div>
            <div class="member-list">
              <span v-for="member in selectedDepartment.members" :key="member">
                {{ member }}
              </span>
            </div>
          </div>
        </article>
      </section>
    </PageContainer>

    <el-dialog
      v-model="dialogVisible"
      title="新增部门"
      width="520px"
      align-center
    >
      <el-form label-position="top">
        <el-form-item label="部门名称" required>
          <el-input
            v-model="newDepartment.label"
            placeholder="例如：客户成功部"
          />
        </el-form-item>
        <el-form-item label="负责人" required>
          <el-input
            v-model="newDepartment.manager"
            placeholder="输入负责人姓名"
          />
        </el-form-item>
        <el-form-item label="部门说明">
          <el-input
            v-model="newDepartment.description"
            :rows="3"
            placeholder="说明该部门的职责范围"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createDepartment">创建部门</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";
import PageContainer from "@/components/PageContainer/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";

defineOptions({ name: "DepartmentManagement" });

interface Department {
  id: number;
  label: string;
  manager: string;
  memberCount: number;
  status: string;
  description: string;
  members: string[];
  children?: Department[];
}

const departments = ref<Department[]>([
  {
    id: 1,
    label: "现代科技集团",
    manager: "林澈",
    memberCount: 38,
    status: "正常",
    description: "集团级组织，用于统一管理平台成员与业务协作。",
    members: ["林澈", "陈屿", "周宁"],
    children: [
      {
        id: 2,
        label: "平台研发部",
        manager: "林澈",
        memberCount: 12,
        status: "正常",
        description: "负责产品研发、基础平台和技术支持。",
        members: ["林澈", "陈序", "许言"],
      },
      {
        id: 3,
        label: "客户成功部",
        manager: "陈屿",
        memberCount: 9,
        status: "正常",
        description: "负责客户交付、培训和续约支持。",
        members: ["陈屿", "苏禾", "沈言"],
      },
      {
        id: 4,
        label: "市场运营部",
        manager: "周宁",
        memberCount: 7,
        status: "正常",
        description: "负责内容运营、活动策划和增长分析。",
        members: ["周宁", "林梧"],
      },
    ],
  },
]);
const selectedDepartment = ref<Department>(departments.value[0].children![0]);
const dialogVisible = ref(false);
const newDepartment = reactive({ label: "", manager: "", description: "" });
const departmentCount = computed(
  () => 1 + (departments.value[0].children?.length || 0)
);

function createDepartment() {
  if (!newDepartment.label.trim() || !newDepartment.manager.trim()) {
    ElMessage.warning("请填写部门名称和负责人");
    return;
  }
  const department: Department = {
    id: Date.now(),
    label: newDepartment.label.trim(),
    manager: newDepartment.manager.trim(),
    memberCount: 1,
    status: "正常",
    description: newDepartment.description.trim() || "暂未填写部门说明。",
    members: [newDepartment.manager.trim()],
  };
  departments.value[0].children?.push(department);
  selectedDepartment.value = department;
  Object.assign(newDepartment, { label: "", manager: "", description: "" });
  dialogVisible.value = false;
  ElMessage.success("部门已创建");
}
</script>

<style scoped lang="scss">
.department-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.75fr) minmax(0, 1.25fr);
  gap: 16px;
}

.tree-card,
.detail-card {
  padding: 20px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.card-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.card-heading h2,
.card-heading h3,
.card-heading p {
  margin: 0;
}

.card-heading h2 {
  font-size: 16px;
}

.card-heading h3 {
  font-size: 14px;
}

.card-heading p,
.eyebrow {
  margin-top: 4px !important;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.eyebrow {
  color: var(--app-primary) !important;
}

.tree-node {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.tree-node small {
  margin-left: auto;
  color: var(--app-text-secondary);
}

.member-section {
  padding-top: 22px;
  margin-top: 22px;
  border-top: 1px solid var(--app-border-color);
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.member-list span {
  padding: 5px 10px;
  font-size: 13px;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 999px;
}

@media (width < 768px) {
  .department-layout {
    grid-template-columns: 1fr;
  }
}
</style>
