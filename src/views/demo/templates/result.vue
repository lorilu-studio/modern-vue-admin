<template>
  <PageContainer>
    <ResultState
      :status="isSuccess ? 'success' : 'error'"
      :title="isSuccess ? '项目创建成功' : '项目创建未完成'"
      :description="
        isSuccess
          ? '项目信息已通过表单校验。此模板使用本地演示数据，接入后端后可在此展示真实处理结果。'
          : '演示一次可恢复的提交失败状态。请检查表单内容后重试，已有输入不会在本示例中保存。'
      "
    >
      <template #actions>
        <el-button @click="router.push('/templates/list')">
          返回项目列表
        </el-button>
        <el-button type="primary" @click="router.push('/templates/basic-form')">
          {{ isSuccess ? "继续创建项目" : "重新填写" }}
        </el-button>
      </template>
      <template #extra>
        <div class="result-summary">
          <span>{{ isSuccess ? "处理状态" : "失败原因" }}</span>
          <strong>
            {{ isSuccess ? "等待后端确认" : "当前页面为静态失败示例" }}
          </strong>
          <el-button link type="primary" @click="toggleResult">
            查看{{ isSuccess ? "失败" : "成功" }}状态示例
          </el-button>
        </div>
      </template>
    </ResultState>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import ResultState from "@/components/ResultState/index.vue";

defineOptions({ name: "ResultTemplate" });

const router = useRouter();
const route = useRoute();
const isSuccess = computed(() => route.path.endsWith("/success"));

function toggleResult() {
  router.push(
    isSuccess.value ? "/templates/result/failure" : "/templates/result/success"
  );
}
</script>

<style scoped lang="scss">
.result-summary {
  display: grid;
  gap: 10px;
  justify-items: center;
  padding: 18px;
  background: var(--app-bg-hover);
  border-radius: var(--app-radius-control);

  span {
    font-size: 12px;
    color: var(--app-text-secondary);
  }
}
</style>
