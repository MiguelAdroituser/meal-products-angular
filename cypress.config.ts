import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    retries: {
      runMode: 5,
      openMode: 0
    },
    defaultCommandTimeout: 60000, // 60 seconds to wait for commands
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

  },
});
