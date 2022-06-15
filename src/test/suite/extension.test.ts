// import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from "vscode";

// import { getTitle } from "../../link";
import * as link from "../../link";

describe("Markdown Link", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Google", () => {
    jest
      .spyOn(link, "getTitle")
      .mockImplementation(() => Promise.resolve("Google"));
    return link.getTitle("https://www.google.com").then((link) => {
      expect(link).toEqual("Google");
    });
  });

  test("GitHub", () => {
    jest
      .spyOn(link, "getTitle")
      .mockImplementation(() =>
        Promise.resolve("GitHub: Where the world builds software · GitHub")
      );
    return link.getTitle("https://www.github.com").then((link) => {
      expect(link).toEqual("GitHub: Where the world builds software · GitHub");
    });
  });

  test("GitHub repository", () => {
    jest
      .spyOn(link, "getTitle")
      .mockImplementation(() =>
        Promise.resolve(
          "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension"
        )
      );
    return link
      .getTitle("https://github.com/kubotama/must-vscode")
      .then((link) => {
        expect(link).toEqual(
          "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension"
        );
      });
  });
});
