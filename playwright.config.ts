import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  /* Jalankan tes berurutan untuk menghindari race condition pada SQLite test.db */
  workers: 1,
  fullyParallel: false,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "desktop",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
      testIgnore: [/.*\.setup\.ts/],
    },
    {
      name: "mobile",
      dependencies: ["setup"],
      use: {
        ...devices["Pixel 7"],
      },
      testIgnore: [/.*\.setup\.ts/],
    },
  ],
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: "production",
      PORT: "3100",
      DB_PATH: "./data/test.db",
      UPLOAD_DIR: "./data/test-uploads",
      SESSION_SECRET: "super_secret_for_playwright_test_session_key_32chars",
      ADMIN_USERNAME: "testadmin",
      ADMIN_PASSWORD: "testadmin12345",
    },
  },
});

