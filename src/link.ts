import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = (
  url: string,
  replaceSelection: (text: string) => void
) => {
  getTitle(url).then((title) => {
    const displayTitle = toDisplayTitle(title, url);
    replaceSelection(`[${displayTitle}](${url})`);
  });
};

export const getTitle = async (url: string) => {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const title = dom.window.document.title;
  return title;
};

export const toDisplayTitle = (title: string, url: string) => {
  const displayTitlePatterns = [
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
  ];

  for (const pattern of displayTitlePatterns) {
    const reurl = new RegExp(pattern.url);
    if (reurl.test(url)) {
      const repattern = new RegExp(pattern.pattern);
      const displayTitle = title.replace(repattern, pattern.format);
      return displayTitle;
    }
  }

  return title;
};
