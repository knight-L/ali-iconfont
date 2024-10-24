#!/usr/bin/env node

import colors from "colors";

console.log(
  [
    "",
    "Usage:",
    "",
    "    " + colors.yellow("npx icon-init") + "       : generate config file",
    "    " +
      colors.yellow("npx icon-get") +
      "         : generate icon components",
    "",
  ].join("\n")
);
