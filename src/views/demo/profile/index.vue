<template>
  <div class="profile-page">
    <PageContainer
      title="我的资料"
      description="管理个人资料、登录安全与当前会话。"
    >
      <section class="profile-grid">
        <article class="profile-card identity-card">
          <span class="avatar">林</span>
          <h2>林澈</h2>
          <p>系统管理员 · 平台研发部</p>
          <StatusTag dot label="账号正常" type="success" />
          <dl>
            <div>
              <dt>登录账号</dt>
              <dd>linche</dd>
            </div>
            <div>
              <dt>最近登录</dt>
              <dd>2026-09-26 10:12</dd>
            </div>
            <div>
              <dt>账号创建</dt>
              <dd>2026-06-18</dd>
            </div>
          </dl>
        </article>

        <article class="profile-card form-card">
          <div class="card-heading">
            <div>
              <h2>基本资料</h2>
              <p>用于账号识别和系统通知。</p>
            </div>
          </div>
          <el-form label-position="top">
            <div class="form-grid">
              <el-form-item label="姓名">
                <el-input v-model="profile.name" />
              </el-form-item>
              <el-form-item label="联系邮箱">
                <el-input v-model="profile.email" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="profile.phone" />
              </el-form-item>
              <el-form-item label="所属部门">
                <el-input v-model="profile.department" disabled />
              </el-form-item>
            </div>
          </el-form>
          <div class="form-actions">
            <el-button type="primary" @click="saveProfile">保存资料</el-button>
          </div>
        </article>
      </section>

      <section class="profile-card security-card">
        <div class="card-heading">
          <div>
            <h2>账号安全</h2>
            <p>敏感操作需要使用受信任的登录凭据。</p>
          </div>
        </div>
        <div class="security-row">
          <div>
            <strong>登录密码</strong>
            <p>建议定期更新密码，且不要与其他服务重复使用。</p>
          </div>
          <el-button @click="passwordVisible = true">修改密码</el-button>
        </div>
        <div class="security-row">
          <div>
            <strong>当前会话</strong>
            <p>macOS · Chrome 140 · 台北 · 192.168.1.20</p>
          </div>
          <StatusTag dot label="当前设备" type="success" />
        </div>
      </section>
    </PageContainer>

    <el-dialog
      v-model="passwordVisible"
      title="修改密码"
      width="460px"
      align-center
    >
      <el-form label-position="top">
        <el-form-item label="当前密码">
          <el-input v-model="password.current" show-password type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="password.next" show-password type="password" />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="password.confirm" show-password type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">更新密码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer/index.vue";
import StatusTag from "@/components/StatusTag/index.vue";

defineOptions({ name: "ProfileCenter" });

const profile = reactive({
  name: "林澈",
  email: "lin@example.com",
  phone: "138 0000 0000",
  department: "平台研发部",
});
const password = reactive({ current: "", next: "", confirm: "" });
const passwordVisible = ref(false);
function saveProfile() {
  ElMessage.success("个人资料已保存");
}
function changePassword() {
  if (
    !password.current ||
    !password.next ||
    password.next !== password.confirm
  ) {
    ElMessage.warning("请填写当前密码，并确认两次新密码一致");
    return;
  }
  Object.assign(password, { current: "", next: "", confirm: "" });
  passwordVisible.value = false;
  ElMessage.success("密码已更新");
}
</script>

<style scoped lang="scss">
.profile-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);
  gap: 16px;
}

.profile-card {
  padding: 22px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.identity-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 16px;
  font-size: 21px;
  font-weight: 700;
  color: var(--app-primary);
  background: var(--app-primary-soft);
  border-radius: 16px;
}

.identity-card h2,
.identity-card p,
.card-heading h2,
.card-heading p {
  margin: 0;
}

.identity-card h2,
.card-heading h2 {
  font-size: 17px;
}

.identity-card p,
.card-heading p,
.security-row p {
  margin-top: 5px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.identity-card :deep(.status-tag) {
  margin-top: 16px;
}

dl {
  display: grid;
  gap: 14px;
  width: 100%;
  padding-top: 20px;
  margin: 20px 0 0;
  border-top: 1px solid var(--app-border-color);
}

dl div {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  font-size: 13px;
}

dt {
  color: var(--app-text-secondary);
}

dd {
  margin: 0;
  color: var(--app-text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.security-card {
  margin-top: 16px;
}

.security-row {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
}

.security-row + .security-row {
  border-top: 1px solid var(--app-border-color);
}

.security-row p {
  margin-bottom: 0;
}

@media (width < 768px) {
  .profile-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .security-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
