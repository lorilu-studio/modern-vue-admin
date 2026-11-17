<template>
  <PageContainer>
    <ResultState
      status="error"
      title="登录状态已失效"
      description="请重新登录后继续访问。若问题持续出现，请联系系统管理员。"
    >
      <template #actions>
        <el-button type="primary" @click="router.push('/login')">
          重新登录
        </el-button>
      </template>
      <template #extra>
        <div class="error-code">401 · UNAUTHENTICATED</div>
      </template>
    </ResultState>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import ResultState from "@/components/ResultState/index.vue";

defineOptions({ name: "Page401" });
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
