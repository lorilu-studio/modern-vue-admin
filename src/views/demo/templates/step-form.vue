<template>
  <PageContainer
    title="分步创建项目"
    description="适用于需要分段填写并在提交前复核内容的流程。"
  >
    <section class="step-card">
      <el-steps :active="step" finish-status="success" class="step-indicator">
        <el-step title="项目信息" description="定义目标与负责人" />
        <el-step title="协作成员" description="安排参与人员" />
        <el-step title="确认提交" description="检查信息并创建" />
      </el-steps>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div v-if="step === 0" class="step-content">
          <div class="step-copy">
            <span>项目设置</span>
            <h2>先说明要完成什么</h2>
            <p>后续可以继续调整项目安排。</p>
          </div>
          <div class="form-grid">
            <el-form-item label="项目名称" prop="name" required>
              <el-input v-model="form.name" placeholder="例如：成员中心迭代" />
            </el-form-item>
            <el-form-item label="项目负责人" prop="owner" required>
              <el-select v-model="form.owner" placeholder="选择负责人">
                <el-option label="林澈" value="林澈" />
                <el-option label="陈屿" value="陈屿" />
                <el-option label="周宁" value="周宁" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目说明" class="wide-field">
              <el-input v-model="form.description" :rows="3" type="textarea" />
            </el-form-item>
          </div>
        </div>

        <div v-else-if="step === 1" class="step-content">
          <div class="step-copy">
            <span>协作安排</span>
            <h2>选择需要参与的成员</h2>
            <p>至少选择一位协作成员，也可以在项目创建后调整。</p>
          </div>
          <el-form-item label="协作成员" prop="members" required>
            <el-select
              v-model="form.members"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="选择成员"
            >
              <el-option label="陈屿 · 客户成功部" value="陈屿" />
              <el-option label="周宁 · 市场运营部" value="周宁" />
              <el-option label="苏禾 · 市场运营部" value="苏禾" />
            </el-select>
          </el-form-item>
        </div>

        <div v-else class="step-content">
          <div class="step-copy">
            <span>提交前检查</span>
            <h2>确认项目安排</h2>
            <p>提交后会展示处理结果。本示例仅展示本地交互，不会保存到后端。</p>
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="项目名称">
              {{ form.name }}
            </el-descriptions-item>
            <el-descriptions-item label="项目负责人">
              {{ form.owner }}
            </el-descriptions-item>
            <el-descriptions-item label="协作成员">
              {{ form.members.join("、") }}
            </el-descriptions-item>
            <el-descriptions-item label="项目说明">
              {{ form.description || "未填写" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form>

      <footer class="step-actions">
        <el-button v-if="step === 0" @click="router.push('/templates/list')">
          取消
        </el-button>
        <el-button v-else @click="step--">上一步</el-button>
        <el-button v-if="step < 2" type="primary" @click="nextStep">
          下一步
        </el-button>
        <el-button v-else type="primary" @click="submit">创建项目</el-button>
      </footer>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import PageContainer from "@/components/PageContainer/index.vue";

defineOptions({ name: "StepFormTemplate" });

const router = useRouter();
const formRef = ref<FormInstance>();
const step = ref(0);
const form = reactive({
  name: "",
  owner: "",
  description: "",
  members: [] as string[],
});
const rules: FormRules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  owner: [{ required: true, message: "请选择项目负责人", trigger: "change" }],
  members: [
    { required: true, message: "请选择至少一位协作成员", trigger: "change" },
  ],
};

async function nextStep() {
  const fields = step.value === 0 ? ["name", "owner"] : ["members"];
  if (!formRef.value) return;
  const valid = await formRef.value
    .validateField(fields)
    .then(() => true)
    .catch(() => false);
  if (valid) step.value += 1;
}
async function submit() {
  await router.push("/templates/result/success?source=step-form");
}
</script>

<style scoped lang="scss">
.step-card {
  max-width: 1080px;
  padding: 28px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.step-indicator {
  max-width: 760px;
  margin: 0 auto 40px;
}

.step-content {
  max-width: 720px;
  min-height: 310px;
  padding: 28px 0 12px;
  margin: 0 auto;
}

.step-copy {
  margin-bottom: 24px;

  > span {
    font-size: 12px;
    color: var(--app-primary);
  }

  h2 {
    margin: 8px 0 6px;
    font-size: 20px;
  }

  p {
    margin: 0;
    line-height: 22px;
    color: var(--app-text-secondary);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}

.wide-field {
  grid-column: 1 / -1;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--app-border-color);
}

@media (width < 640px) {
  .step-card {
    padding: 18px 14px;
  }

  .step-content {
    min-height: 360px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
