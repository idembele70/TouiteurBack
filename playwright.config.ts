import { PlaywrightTestConfig, devices } from '@playwright/test';
import { baseURL } from './src/e2e/global_constant';

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
  testDir: './src/e2e',
  timeout: 15 * 1000,
  /* Run tests in files in serial */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'local',
      use: {
        baseURL: baseURL.local,
        ...devices['Desktop Chrome'],
        headless:true,
       },
    },
  ],
  webServer: {
    command: 'npm run start:localhost',
    url: baseURL.local,
    reuseExistingServer: !process.env.CI,
  },
};

export default config