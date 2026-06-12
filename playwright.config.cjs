const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
	testDir: "./playwright",
	use: {
		baseURL: "https://mitali-chavan-bakehouse.cta-training.academy",
		headless: false,
	},
})
