# modern-vue-admin 项目协作规则

## 包管理器

- 统一使用 npm；依赖变更同步更新 `package-lock.json`。
- 依赖安装使用 `npm install`；CI、部署和干净环境使用 `npm ci`。

## 修改与提交

每个提交只包含一个逻辑改动，完成后再开始下一批：

1. 修改前执行 `git status --short`，识别并保留既有未提交改动。
2. 只修改当前任务需要的内容，运行 `npm run type-check`、`npm run lint:eslint`、`npm run lint:style`、`npm test`；按改动范围补充构建等验证。
3. 执行 `git diff --check` 并回读差异，确认没有临时文件、密钥或无关变更；只暂存本批文件，不使用无范围的 `git add -A`。
4. 向用户展示改动、验证结果和拟用提交信息。取得**本次提交**的确认后执行 `git commit`，再检查 `git status --short` 和 `git log -1 --oneline`。

提交是本地回退点。除非用户明确要求，不执行 push、发布、部署、远程仓库变更、历史改写、`git reset --hard` 或覆盖其他人的改动。

提交信息遵循 Angular 格式：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- **type** 必填，只能使用：`feat` 新功能、`fix` 修复 bug、`docs` 只改文档、`style` 只调整格式且不影响逻辑、`refactor` 重构且不增加功能或修复 bug、`perf` 性能优化、`test` 添加或修改测试、`build` 构建系统或依赖变更、`ci` CI 配置变更、`chore` 其他不改源码和测试的杂项、`revert` 回滚之前的提交。
- **scope** 建议填写，按本项目的改动范围从 `app`、`api`、`router`、`store`、`layout`、`ui`、`mock`、`i18n`、`build`、`deps`、`docs`、`test`、`ci` 中选择。跨多个范围时选最主要的一个，或省略。
- **subject** 必填，用中文简要说明做了什么，动词开头，不超过 50 个字符，结尾不加句号。
- **body** 可选，说明修改原因及与之前的差异，每行不超过 72 个字符。
- **footer** 可选。不兼容的变更以 `BREAKING CHANGE: ` 开头，写明变化和迁移方法；关联 issue 写 `Closes #123`。
- `type`、`scope` 使用英文小写，冒号后加一个空格。没有 `scope` 时格式为 `<type>: <subject>`。

## 变更边界

- 用户明确说明优先于本文件；如果用户要求不提交，必须以用户当前要求为准。
- 不删除、重命名或覆盖文件，除非当前任务明确包含该操作。
- 发现与当前任务无关的问题时只记录，不顺手修复。
- 修改前先检查真实调用链和现有实现，优先复用已有依赖与组件。
- 修复问题先定位根因，检查调用方、数据与权限影响及反例；重复问题补充回归测试或项目规则。
- 删除依赖、组件、资源或配置前，先做全局引用检查，并在删除后运行类型检查和构建。
