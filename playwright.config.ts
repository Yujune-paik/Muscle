import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 150_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:8081',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'critical-chromium',
      testMatch: /(?:critical-flow|screenshots)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'scroll-wide-chromium',
      testMatch: /scroll-and-media\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 667 } },
    },
    {
      name: 'scroll-small-chromium',
      testMatch: /scroll-and-media\.spec\.ts/,
      use: { ...devices['Pixel 5'], viewport: { width: 320, height: 568 } },
    },
    {
      name: 'scroll-webkit-iphone',
      testMatch: /scroll-and-media\.spec\.ts/,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'scroll-firefox',
      testMatch: /scroll-and-media\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 390, height: 667 } },
    },
  ],
  webServer: {
    command: 'npx --yes --package node@22.22.0 -- node node_modules/expo/bin/cli start --web --port 8081',
    url: 'http://127.0.0.1:8081',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
