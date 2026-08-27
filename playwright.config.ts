import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./fixtures/globalSetup'),
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  timeout: 0,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'reports/html/playwright-report',
    }],
    [
      'allure-playwright', {
        resultsDir: 'reports/allure/allure-results',
        detail: true,
        suiteTitle: false,
    }],
    ['junit', {
      outputFile: 'reports/junit/test-results.xml',
    }]
  ],
  outputDir: 'src/test-results/',
  use: {
    headless: true,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    testIdAttribute: 'data-test',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

});
