<template>
  <PageContainer>
    <ResultState
      status="forbidden"
      title="无权访问此页面"
      description="当前账号缺少访问权限。你可以返回上一页，或联系管理员调整角色权限。"
    >
      <template #actions>
        <el-button @click="router.back()">返回上一页</el-button>
        <el-button type="primary" @click="router.push('/dashboard')">
          回到工作台
        </el-button>
      </template>
      <template #extra>
        <div class="error-code">403 · FORBIDDEN</div>
      </template>
    </ResultState>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import ResultState from "@/components/ResultState/index.vue";

defineOptions({ name: "Page403" });
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
