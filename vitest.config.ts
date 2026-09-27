import { fileURLToPath } from "node:url";

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

/**
 * Mirrors the "imports" field in package.json, pointing at the TypeScript sources
 * instead of the compiled output in dist/.
 */
const alias = [
  { find: "#config", replacement: src("modules/appconfig/appconfig.service.ts") },
  { find: /^#problems\/(dto|exception|filter|response)$/, replacement: src("problems/$1/index.ts") },
  { find: "#utils", replacement: src("utils/index.ts") },
  { find: /^#(modules|providers)\/(.*)\.js$/, replacement: src("$1/$2.ts") }
];

export default defineConfig({
  // SWC instead of esbuild, because NestJS dependency injection relies on emitDecoratorMetadata
  plugins: [swc.vite({ module: { type: "es6" } })],
  resolve: { alias },
  test: {
    globals: true,
    environment: "node",
    env: { NODE_ENV: "development", BASE_URL: "http://localhost:8080" },
    coverage: { include: ["src/**/*.ts"], exclude: ["src/**/generated/**"], reportsDirectory: "coverage" },
    projects: [
      { extends: true, test: { name: "unit", include: ["src/**/*.spec.ts"] } },
      { extends: true, test: { name: "e2e", include: ["test/**/*.e2e-spec.ts"] } }
    ]
  }
});
