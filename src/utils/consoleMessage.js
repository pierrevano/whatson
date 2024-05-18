const { version } = require("../../package.json");

const consoleMessage = () => {
  const styleHeader =
    "padding-top: 0.5em; font-size: 2em; padding-bottom: 0.5em;";
  const styleVersion =
    "background: #28A745; font-size: 1.8em; color: #FFF; padding: 0.1em";
  const styleMessage = "padding-top: 0em; font-size: 1em; padding-bottom: 0em;";
  console.log(
    `%cWelcome to What's on? %cv${version}%c\nDoes this page needs fixes or improvements? Open an issue or contribute to a merge request to help make What's on? more lovable.\n\n🔎 Create a new GitHub issue: https://github.com/pierrevano/whatson/issues/new`,
    styleHeader,
    styleVersion,
    styleMessage,
  );
};

module.exports = consoleMessage;
