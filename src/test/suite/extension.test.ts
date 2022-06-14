import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { urlToLink } from "../../link";

suite("Markdown Link", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Google", (done) => {
    urlToLink("https://www.google.com").then((link) => {
      assert.equal(link, "[Google](https://www.google.com)");
    });
    done();
  });

  test("GitHub", (done) => {
    urlToLink("https://www.github.com").then((link) => {
      assert.equal(
        link,
        "[GitHub: Where the world builds software · GitHub](https://www.github.com)"
      );
    });
    done();
  });

  test("GitHub repository", (done) => {
    urlToLink("https://github.com/kubotama/must-vscode").then((link) => {
      assert.equal(
        link,
        "[GitHub - kubotama/must-vscode: MarkUp support tool by netlify](https://github.com/kubotama/must-vscode)"
      );
    });
    done();
  });
});
