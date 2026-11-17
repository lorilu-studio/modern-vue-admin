<template>
  <PageContainer>
    <ResultState
      status="error"
      title="页面不存在"
      description="访问地址可能已失效、被移动，或输入有误。请检查地址后重试。"
    >
      <template #actions>
        <el-button @click="router.back()">返回上一页</el-button>
        <el-button type="primary" @click="router.push('/dashboard')">
          回到工作台
        </el-button>
      </template>
      <template #extra>
        <div class="error-code">404 · PAGE NOT FOUND</div>
      </template>
    </ResultState>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import ResultState from "@/components/ResultState/index.vue";

defineOptions({ name: "Page404" });
const router = useRouter();
</script>

<style scoped lang="scss">
.error-code {
  font-family: var(--app-font-mono);
  font-size: 12px;
  color: var(--app-text-placeholder);
  letter-spacing: 0.08em;
}
</style>
