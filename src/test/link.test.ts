import * as link from "../link";

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

const titlePatterns = [
  {
    url: "https://www.github.com/.*",
    pattern: "GitHub - (.*)",
    format: "$1",
  },
  {
    url: "https://qiita.com/.*",
    pattern: "(.*) - Qiita",
    format: "$1",
  },
  {
    url: "https://toyokeizai.net/articles/.*",
    pattern: "(.*) \\| 東洋経済オンライン \\| 社会をよくする経済ニュース",
    format: "$1",
  },
  {
    url: "https://gihyo.jp/.*",
    pattern: "(.*)｜gihyo.jp … 技術評論社",
    format: "$1",
  },
  {
    url: "https://xtech.nikkei.com/.*",
    pattern: "(.*) \\| 日経クロステック（xTECH）",
    format: "$1",
  },
];

describe("issue #9: Change the title retrieved from the site to a predefined format", () => {
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
        "kubotama/must-vscode: markup language support tool of Visual Studio Code extension",
    },
    {
      url: "https://qiita.com/kubotama/items/c3931fb9145f5021d39a",
      title: "Vuetifyをインストールした環境でJestを実行する設定 - Qiita",
      expected: "Vuetifyをインストールした環境でJestを実行する設定",
    },
    {
      url: "https://toyokeizai.net/articles/-/589018?utm_source=rss&utm_medium=http&utm_campaign=link_back",
      title:
        "継ぎ足した｢秘伝の醤油｣腐らせた新米職人の決断 | 江戸前の旬 | 東洋経済オンライン | 社会をよくする経済ニュース",
      expected: "継ぎ足した｢秘伝の醤油｣腐らせた新米職人の決断 | 江戸前の旬",
    },
    {
      url: "https://gihyo.jp/admin/clip/01/linux_dt/202206/20",
      title:
        "2022年6月20日　ワンライナーのお手本!? SUSEエンジニアが作成したext4のパフォーマンス改善パッチ：Linux Daily Topics｜gihyo.jp … 技術評論社",
      expected:
        "2022年6月20日　ワンライナーのお手本!? SUSEエンジニアが作成したext4のパフォーマンス改善パッチ：Linux Daily Topics",
    },
    {
      url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      title:
        "「IE終了でもIEモードで大丈夫」は本当か、ブラウザー移行の先送りで訪れる悲劇 | 日経クロステック（xTECH）",
      expected:
        "「IE終了でもIEモードで大丈夫」は本当か、ブラウザー移行の先送りで訪れる悲劇",
    },
  ])("$expected", ({ url, title, expected }) => {
    const displayTitle = link.toDisplayTitle({ title, titlePatterns, url });

    expect(displayTitle).toEqual(expected);
  });
});

const urlPatterns = [
  {
    url: "(https://toyokeizai.net/articles/.*)\\?.*",
    format: "$1",
  },
  {
    url: "(https://xtech.nikkei.com/atcl/nxt/column/.*)\\?.*",
    format: "$1",
  },
];

describe("urlToLink", () => {
  test.each([
    {
      url: "https://www.google.com",
      title: "Google",
      expected: "[Google](https://www.google.com)",
    },
    {
      url: "https://www.github.com/",
      title: "GitHub: Where the world builds software · GitHub",
      expected:
        "[GitHub: Where the world builds software · GitHub](https://www.github.com/)",
    },
    {
      url: "https://www.github.com/must-vscode",
      title:
        "GitHub - kubotama/must-vscode: markup language support tool of Visual Studio Code extension",
      expected:
        "[kubotama/must-vscode: markup language support tool of Visual Studio Code extension](https://www.github.com/must-vscode)",
    },
    {
      url: "https://qiita.com/kubotama/items/c3931fb9145f5021d39a",
      title: "Vuetifyをインストールした環境でJestを実行する設定 - Qiita",
      expected:
        "[Vuetifyをインストールした環境でJestを実行する設定](https://qiita.com/kubotama/items/c3931fb9145f5021d39a)",
    },
    {
      url: "https://toyokeizai.net/articles/-/589018?utm_source=rss&utm_medium=http&utm_campaign=link_back",
      title:
        "継ぎ足した｢秘伝の醤油｣腐らせた新米職人の決断 | 江戸前の旬 | 東洋経済オンライン | 社会をよくする経済ニュース",
      expected:
        "[継ぎ足した｢秘伝の醤油｣腐らせた新米職人の決断 | 江戸前の旬](https://toyokeizai.net/articles/-/589018)",
    },
  ])("$expected", ({ url, title, expected }) => {
    jest
      .spyOn(link, "getTitle")
      .mockImplementation(() => Promise.resolve(title));
    const markdownLinkFormat = "[${title}](${url})";

    link
      .urlToLink(url, titlePatterns, urlPatterns, markdownLinkFormat)
      .then((link) => {
        expect(link).toEqual(expected);
      });
  });
});

describe("toDisplayUrl", () => {
  test.each([
    {
      url: "https://www.google.com",
      expected: "https://www.google.com",
    },
    {
      url: "https://toyokeizai.net/articles/-/589018?utm_source=rss&utm_medium=http&utm_campaign=link_back",
      expected: "https://toyokeizai.net/articles/-/589018",
    },
    {
      url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      expected: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/",
    },
  ])("$expected", ({ url, expected }) => {
    const displayUrl = link.toDisplayUrl(url, urlPatterns);

    expect(displayUrl).toEqual(expected);
  });
});
