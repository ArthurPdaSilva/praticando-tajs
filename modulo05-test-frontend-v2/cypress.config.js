import preprocessor from "@badeball/cypress-cucumber-preprocessor";
import createESBuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createESBuildPlugin.default(config)],
    })
  );

  return config;
}

// Ele tá sendo setado no package
const { WEB_SERVER_URL } = process.env;
if (!WEB_SERVER_URL) {
  console.error("Missing WEB_SERVER_URL environment variable!");
  process.exit(1);
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/e2e/features/*.feature",
    baseUrl: WEB_SERVER_URL,
    // Test isolation FAZ COM QUE O CYPRESS REINICIE O BROWSER A CADA CENÁRIO
    // testIsolation: false,
  },
});
