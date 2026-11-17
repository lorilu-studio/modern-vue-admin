import assert from "node:assert/strict";
import { resolveConfig } from "vite";

const development = await resolveConfig({ mode: "development" }, "serve");
const production = await resolveConfig({ mode: "production" }, "build");
const hasDevTools = (config) =>
  config.plugins.some((plugin) => plugin.name === "vite-plugin-vue-devtools");

assert.equal(
  development.server.host,
  development.env.VITE_DEV_HOST || "localhost"
);
assert.equal(development.server.open, development.env.VITE_DEV_OPEN === "true");
assert.equal(hasDevTools(development), true);
assert.equal(hasDevTools(production), false);
assert.equal(development.css.preprocessorOptions.scss.api, "modern");
assert.equal(typeof development.env.VITE_MOCK_DEV_SERVER, "string");
assert.ok(production.env.VITE_APP_BASE_API.startsWith("/"));
assert.equal(production.env.VITE_MOCK_DEV_SERVER === "true", false);
console.log("Vite environment and DevTools checks passed.");
