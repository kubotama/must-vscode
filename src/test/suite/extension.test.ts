import * as link from "../../link";

describe("Markdown Link", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    { url: "https://www.google.com", title: "Google", expected: "Google" },
    {
      url: "https://www.github.com/",
      title: "GitHub: Where the world builds software · GitHub",
      expected: "GitHub: Where the world builds software · GitHub",
    },
    {
      url: "https://www.github.com/must-vscode",
      title:
        "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension",
      expected:
        "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension",
    },
  ])("$title", ({ url, title, expected }) => {
    jest
      .spyOn(link, "getTitle")
      .mockImplementation(() => Promise.resolve(title));
    return link.getTitle(url).then((link) => {
      expect(link).toEqual(expected);
    });
  });
});
