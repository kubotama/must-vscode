// import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from "vscode";

import { getTitle } from "../../link";

describe("Markdown Link", () => {
  // vscode.window.showInformationMessage("Start all tests.");

  test("Google", () => {
    return getTitle("https://www.google.com").then((link) => {
      expect(link).toEqual("Google");
    });
  });

  test("GitHub", () => {
    return getTitle("https://www.github.com").then((link) => {
      expect(link).toEqual("GitHub: Where the world builds software · GitHub");
    });
  });

  test("GitHub repository", () => {
    return getTitle("https://github.com/kubotama/must-vscode").then((link) => {
      expect(link).toEqual(
        "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension"
      );
    });
  });
});
