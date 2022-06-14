import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { urlToLink } from "../../link";

suite("Markdown Link", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Google", () => {
    return urlToLink("https://www.google.com").then((link) => {
      assert.equal(link, "[Google](https://www.google.com)");
    });
  });

  test("GitHub", () => {
    return urlToLink("https://www.github.com").then((link) => {
      assert.equal(
        link,
        "[GitHub: Where the world builds software · GitHub](https://www.github.com)"
      );
    });
  });

  test("GitHub repository", () => {
    return urlToLink("https://github.com/kubotama/must-vscode").then((link) => {
      assert.equal(
        link,
        "[GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension](https://github.com/kubotama/must-vscode)"
      );
    });
  });
});
