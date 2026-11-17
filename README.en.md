# modern-vue-admin

[简体中文](./README.md) | English

A Vue 3, TypeScript, Vite, Pinia and Element Plus admin template with dynamic menus, permission examples, layouts, themes, tabs, local mocks and CRUD examples.

Version 1.0.0. Licensed under [Apache-2.0](./LICENSE). This is an application template, not an npm library. Demo data lives in page memory; production APIs and authorization must be supplied by your backend.

## Quick start

Requires Node.js 18.18+ and npm 9+.

```bash
npm ci
npm run dev
```

Open the Vite URL, normally `http://localhost:3000`. The development mock uses `admin` / `123456`. Mock login does not validate passwords and must not be deployed as a public authentication service.

## Checks

```bash
npm run check:config
npm run type-check
npm run lint:eslint
npm run lint:style
npm run format:check
npm test
npm run build
```

See the [getting started guide](./docs/01-getting-started.md), [API integration](./docs/02-api-integration.md), [deployment](./docs/03-deployment.md), [security reporting](./docs/04-security.md), [contributing guide](./docs/05-contributing.md), [changelog](./docs/06-changelog.md), and [customization guide](./docs/07-customization.md). Detailed guides are currently in Chinese.
