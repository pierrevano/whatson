const fs = require("fs");
const { version } = require("./package.json");

fs.writeFile(
  "./public/meta.json",
  JSON.stringify({ version }),
  "utf8",
  (error) => {
    if (error) {
      console.error("Error occurred on generating meta.json:", error);
      return;
    }
    // eslint-disable-next-line no-console
    console.info(`meta.json updated with latest version: ${version}`);
  }
);
