import { PlaywrightTestConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 15 * 1000,
  /* Run tests in files in serial */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:5000',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'local',
      use: { ...devices['Desktop Chrome'] },
      
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:5000',
  },
};

export default config