<template>
  <div class="theme-preview app-container">
    <header class="preview-header">
      <div>
        <p class="preview-eyebrow">Design system</p>
        <h1>主题预览</h1>
        <p>集中检查语义颜色、表单、数据组件与反馈状态。</p>
      </div>
      <div class="preview-actions">
        <el-radio-group v-model="settingsStore.theme" aria-label="主题模式">
          <el-radio-button :value="ThemeEnum.LIGHT">浅色</el-radio-button>
          <el-radio-button :value="ThemeEnum.DARK">深色</el-radio-button>
          <el-radio-button :value="ThemeEnum.AUTO">跟随系统</el-radio-button>
        </el-radio-group>
        <size-select />
      </div>
    </header>

    <section class="preview-grid preview-colors">
      <article v-for="color in colors" :key="color.name" class="preview-card">
        <span class="color-swatch" :style="{ background: color.value }"></span>
        <strong>{{ color.name }}</strong>
        <code>{{ color.variable }}</code>
      </article>
    </section>

    <section class="preview-card preview-section">
      <div class="section-heading">
        <div>
          <h2>操作与输入</h2>
          <p>主要、次要、危险和禁用状态。</p>
        </div>
      </div>
      <div class="component-row">
        <el-button type="primary">保存修改</el-button>
        <el-button>取消</el-button>
        <el-button type="danger" plain>删除</el-button>
        <el-button disabled>不可用</el-button>
      </div>
      <div class="form-grid">
        <el-input v-model="form.name" placeholder="输入名称" />
        <el-select v-model="form.status" placeholder="选择状态">
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
        />
        <el-switch v-model="form.enabled" active-text="启用" />
      </div>
    </section>

    <section class="preview-card preview-section">
      <div class="section-heading">
        <div>
          <h2>数据展示</h2>
          <p>表头、数字对齐、状态与操作反馈。</p>
        </div>
        <el-button circle aria-label="刷新">
          <AppIcon name="refresh" />
        </el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="name" label="项目" min-width="180" />
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="amount" label="金额" width="140" align="right" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '运行中' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <el-button link type="primary">查看</el-button>
        </el-table-column>
      </el-table>
    </section>

    <section class="preview-grid preview-feedback">
      <el-alert title="配置已保存" type="success" show-icon :closable="false" />
      <el-alert
        title="数据加载失败，请重试"
        type="error"
        show-icon
        :closable="false"
      />
      <div class="preview-card preview-section">
        <h2>加载状态</h2>
        <el-skeleton :rows="3" animated />
      </div>
      <div class="preview-card preview-section">
        <el-empty description="暂无数据">
          <el-button type="primary">创建内容</el-button>
        </el-empty>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "@/components/AppIcon/index.vue";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { useSettingsStore } from "@/store";

defineOptions({ name: "ThemePreview" });

const settingsStore = useSettingsStore();
const form = reactive({
  name: "运营平台",
  status: "enabled",
  date: "",
  enabled: true,
});
const colors = [
  { name: "页面背景", variable: "--app-bg-page", value: "var(--app-bg-page)" },
  {
    name: "内容表面",
    variable: "--app-bg-surface",
    value: "var(--app-bg-surface)",
  },
  { name: "品牌主色", variable: "--app-primary", value: "var(--app-primary)" },
  { name: "成功状态", variable: "--app-success", value: "var(--app-success)" },
  { name: "警告状态", variable: "--app-warning", value: "var(--app-warning)" },
  { name: "危险状态", variable: "--app-danger", value: "var(--app-danger)" },
];
const tableData = [
  {
    name: "客户运营后台",
    owner: "林澈",
    amount: "¥ 128,400",
    status: "运行中",
  },
  { name: "数据治理计划", owner: "陈屿", amount: "¥ 86,200", status: "已归档" },
];
</script>

<style scoped lang="scss">
.theme-preview {
  display: grid;
  gap: 20px;
}

.preview-header,
.section-heading,
.preview-actions,
.component-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.preview-header,
.section-heading {
  justify-content: space-between;
}

.preview-header h1,
.preview-section h2,
.preview-header p,
.preview-section p {
  margin: 0;
}

.preview-header h1 {
  margin-bottom: 4px;
  font-size: 28px;
  line-height: 36px;
}

.preview-header p,
.preview-section p,
.preview-card code {
  color: var(--app-text-secondary);
}

.preview-eyebrow {
  margin-bottom: 6px !important;
  font-size: 12px;
  font-weight: 700;
  color: var(--app-primary) !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.preview-grid {
  display: grid;
  gap: 16px;
}

.preview-colors {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.preview-card {
  padding: 20px;
  background: var(--app-bg-surface);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-card);
}

.preview-colors .preview-card {
  display: grid;
  gap: 8px;
  padding: 12px;
}

.color-swatch {
  width: 100%;
  height: 64px;
  border: 1px solid var(--app-border-color);
  border-radius: 8px;
}

.preview-section {
  display: grid;
  gap: 20px;
}

.section-heading h2,
.preview-section h2 {
  margin-bottom: 2px;
  font-size: 16px;
}

.component-row {
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: center;
}

.preview-feedback {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (width < 992px) {
  .preview-colors {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width < 768px) {
  .preview-header,
  .preview-actions {
    align-items: flex-start;
  }

  .preview-header,
  .preview-actions,
  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  .preview-colors,
  .preview-feedback {
    grid-template-columns: 1fr;
  }
}
</style>
