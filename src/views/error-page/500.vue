<template>
  <PageContainer>
    <ResultState
      status="error"
      title="服务暂时不可用"
      description="系统遇到了临时问题。请稍后重试；若问题持续存在，请联系系统管理员。"
    >
      <template #actions>
        <el-button @click="router.push('/dashboard')">回到工作台</el-button>
        <el-button type="primary" @click="reload">重新加载</el-button>
      </template>
      <template #extra>
        <el-alert
          title="系统异常（500）"
          description="重新加载不会丢失已经成功保存的数据。"
          type="error"
          :closable="false"
          show-icon
        />
      </template>
    </ResultState>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import ResultState from "@/components/ResultState/index.vue";

defineOptions({ name: "Page500" });
const router = useRouter();
const reload = () => window.location.reload();
</script>
