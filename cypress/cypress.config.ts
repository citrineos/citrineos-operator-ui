import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '6ZV3T4-Lyy7B3-Dr5Uhd',
  retries: {
    runMode: 3,
  },
  chromeWebSecurity: false,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 1,
  // viewportWidth: 1920,
  // viewportHeight: 1080,
  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
  },
});
