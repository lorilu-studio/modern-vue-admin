# modern-vue-admin

[简体中文](./README.md) | English

`modern-vue-admin` is a Chinese-first Vue 3 admin starter built with TypeScript, Vite, Pinia, and Element Plus. It includes local mocks, dynamic menus, permission boundaries, dashboard layouts, and CRUD interaction examples.

Version: `1.0.0`. See [CHANGELOG.md](./CHANGELOG.md).

## Scope

- Start a new business admin application from a maintained UI and engineering baseline.
- Reuse the interaction patterns for access control, audit, and profile pages.
- Create a new repository with GitHub's **Use this template** action.

This repository is not an npm package and does not include a production backend, persistent data storage, or server-side authorization. A hosted demo is not available yet; the local Mock mode runs the complete interface.

## Quick start

Requires Node.js 18.18+ and npm 9+.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:3000`. The Mock account is `admin` / `123456`.

## Quality checks

```bash
npm run check:config
npm run type-check
npm run lint:eslint
npm run lint:style
npm run format:check
npm test
npm run build
```

## Real API integration

The management pages use local Mock data. Create typed API modules under `src/api/`, keep permission codes stable, and replace in-page arrays with API calls. The backend must enforce authorization for every read and write operation; frontend visibility checks are only UX.

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), and the [MIT License](./LICENSE).

For the user-management contract and static hosting requirements, see [API integration](./docs/API_INTEGRATION.md) and [deployment](./docs/DEPLOYMENT.md).
