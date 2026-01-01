import { defineConfig, devices } from '@playwright/test';

const ci = !!process.env.CI;
const baseURL = 'http://127.0.0.1:4304';

export default defineConfig({
  testDir: './src',
  // Fairness rule: in CI a Playwright process runs one test at a time (1 worker, no
  // fullyParallel, no retries), so Nx --parallel is the only parallelism knob.
  workers: ci ? 1 : undefined,
  fullyParallel: !ci,
  retries: 0,
  forbidOnly: ci,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm exec nx run homes-0004:serve-static',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
