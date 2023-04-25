const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://barrigarest.wcaquino.me',
    env: {
      USER: process.env.USER,
      PASSWORD: process.env.PASSWORD,
    },
    // defaultCommandTimeout: 1000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
