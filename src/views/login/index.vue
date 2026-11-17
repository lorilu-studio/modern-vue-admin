<template>
  <div class="login-container">
    <main class="login-shell">
      <section class="login-brand" aria-labelledby="brand-title">
        <div class="brand-mini">
          <span><img :src="modernVueAdminMark" alt="" /></span>
          <strong>modern-vue-admin</strong>
        </div>
        <div class="brand-content">
          <span class="brand-kicker">
            MODERN-VUE-ADMIN · {{ defaultSettings.version }}
          </span>
          <h1 id="brand-title">
            让管理工作
            <br />
            更清晰、更专注
          </h1>
          <p>
            一套面向真实业务的现代管理后台基座，保留熟悉的技术栈，也保留持续扩展的空间。
          </p>
          <ul>
            <li>
              <AppIcon name="check" :size="18" />
              <span>
                <strong>稳定架构</strong>
                Vue 3、Vite、TypeScript 与 Pinia
              </span>
            </li>
            <li>
              <AppIcon name="check" :size="18" />
              <span>
                <strong>业务就绪</strong>
                权限、动态路由、Mock 与请求层
              </span>
            </li>
            <li>
              <AppIcon name="check" :size="18" />
              <span>
                <strong>统一体验</strong>
                主题、布局、页面模板与状态反馈
              </span>
            </li>
          </ul>
        </div>
        <span class="brand-foot">稳定 · 清晰 · 可扩展</span>
      </section>

      <section class="login-panel">
        <div class="toolbar-actions">
          <button
            type="button"
            :aria-label="themeLabel"
            :title="themeLabel"
            @click="toggleTheme"
          >
            <AppIcon :name="settingsStore.isDark ? 'sunny' : 'moon'" />
          </button>
          <div class="language-button" aria-label="切换语言">
            <LangSelect size="18" />
          </div>
        </div>

        <div class="login-card">
          <div class="login-heading">
            <span>欢迎回来</span>
            <h2>登录管理后台</h2>
            <p>请输入账号信息以继续访问工作台。</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="loginRules"
            label-position="top"
            class="login-form"
            @submit.prevent="handleLoginSubmit"
          >
            <el-form-item prop="username" :label="$t('login.username')">
              <el-input
                v-model="loginData.username"
                :placeholder="$t('login.username')"
                name="username"
                autocomplete="username"
                size="large"
              >
                <template #prefix><AppIcon name="user-round" /></template>
              </el-input>
            </el-form-item>

            <el-tooltip
              :visible="isCapslock"
              :content="$t('login.capsLock')"
              placement="right"
            >
              <el-form-item prop="password" :label="$t('login.password')">
                <el-input
                  v-model="loginData.password"
                  :placeholder="$t('login.password')"
                  type="password"
                  name="password"
                  autocomplete="current-password"
                  size="large"
                  show-password
                  @keyup="checkCapslock"
                  @keyup.enter="handleLoginSubmit"
                >
                  <template #prefix><AppIcon name="lock" /></template>
                </el-input>
              </el-form-item>
            </el-tooltip>

            <el-button
              native-type="submit"
              :loading="loading"
              type="primary"
              size="large"
              class="login-submit"
            >
              {{ $t("login.login") }}
            </el-button>
          </el-form>

          <div class="demo-account">
            <span>演示账号</span>
            <code>admin</code>
            <span class="divider"></span>
            <span>密码</span>
            <code>123456</code>
          </div>
        </div>
        <footer>modern-vue-admin · Powered by Vue 3 & Element Plus</footer>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { LocationQuery } from "vue-router";
import AuthAPI, { type LoginData } from "@/api/auth";
import modernVueAdminMark from "@/assets/modern-vue-admin-mark.svg";
import AppIcon from "@/components/AppIcon/index.vue";
import LangSelect from "@/components/LangSelect/index.vue";
import { ThemeEnum } from "@/enums/ThemeEnum";
import router from "@/router";
import defaultSettings from "@/settings";
import { useSettingsStore, useUserStore } from "@/store";
import "@/styles/login.scss";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const { t } = useI18n();
const loading = ref(false);
const isCapslock = ref(false);
const loginFormRef = ref<FormInstance>();
const themeLabel = computed(() =>
  settingsStore.isDark ? "切换至浅色模式" : "切换至深色模式"
);

const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
});

const loginRules = computed(() => ({
  username: [
    {
      required: true,
      trigger: "blur",
      message: t("login.message.username.required"),
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: t("login.message.password.required"),
    },
    { min: 6, trigger: "blur", message: t("login.message.password.min") },
  ],
}));

function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    userStore
      .login(loginData.value)
      .then(() => {
        const { path, queryParams } = parseRedirect();
        router.push({ path, query: queryParams });
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";
  const url = new URL(redirect, window.location.origin);
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return { path: url.pathname, queryParams };
}

function toggleTheme() {
  settingsStore.changeTheme(
    settingsStore.isDark ? ThemeEnum.LIGHT : ThemeEnum.DARK
  );
}

function checkCapslock(event: KeyboardEvent) {
  isCapslock.value = event.getModifierState("CapsLock");
}
</script>
