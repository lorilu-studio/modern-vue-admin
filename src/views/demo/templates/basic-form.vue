<template>
  <PageContainer
    title="创建项目"
    description="适用于字段数量较少、无需跨步骤确认的录入任务。"
  >
    <section class="form-card">
      <div class="form-heading">
        <div>
          <h2>项目信息</h2>
          <p>带星号的字段为必填项。</p>
        </div>
        <span class="form-note">本页为本地交互示例</span>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="project-form"
      >
        <div class="form-grid">
          <el-form-item label="项目名称" prop="name" required>
            <el-input v-model="form.name" placeholder="例如：成员中心迭代" />
          </el-form-item>
          <el-form-item label="项目编码" prop="code" required>
            <el-input v-model="form.code" placeholder="例如：PRJ-2026-022" />
          </el-form-item>
          <el-form-item label="项目负责人" prop="owner" required>
            <el-select v-model="form.owner" placeholder="选择负责人">
              <el-option label="林澈" value="林澈" />
              <el-option label="陈屿" value="陈屿" />
              <el-option label="周宁" value="周宁" />
            </el-select>
          </el-form-item>
          <el-form-item label="计划完成日期" prop="dueDate" required>
            <el-date-picker
              v-model="form.dueDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>
        <el-form-item label="项目说明" prop="description">
          <el-input
            v-model="form.description"
            :rows="4"
            maxlength="240"
            show-word-limit
            type="textarea"
            placeholder="说明项目目标、交付范围或协作事项"
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button @click="router.push('/templates/list')">取消</el-button>
        <el-button type="primary" @click="save">创建项目</el-button>
      </div>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import PageContainer from "@/components/PageContainer/index.vue";

defineOptions({ name: "BasicFormTemplate" });

const router = useRouter();
const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  code: "",
  owner: "",
  dueDate: "",
  description: "",
});
const rules: FormRules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
  owner: [{ required: true, message: "请选择项目负责人", trigger: "change" }],
  dueDate: [
    { required: true, message: "请选择计划完成日期", trigger: "change" },
  ],
};

async function save() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  await router.push("/templates/result/success?source=basic-form");
}
</script>

<style scoped lang="scss">
.form-card {
  max-width: 960px;
  padding: 24px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.form-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--app-border-color);

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 16px;
  }

  p {
    margin-top: 6px;
    font-size: 13px;
    color: var(--app-text-secondary);
  }
}

.form-note {
  padding: 4px 8px;
  font-size: 12px;
  color: var(--app-text-secondary);
  background: var(--app-bg-muted);
  border-radius: 6px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  margin-top: 10px;
  border-top: 1px solid var(--app-border-color);
}

@media (width < 640px) {
  .form-card {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
