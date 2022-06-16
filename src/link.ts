import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = (
  url: string,
  titlePatterns: TitlePattern[],
  replaceSelection: (text: string) => void
) => {
  getTitle(url).then((title) => {
    const displayTitle = toDisplayTitle({ title, url, titlePatterns });
    replaceSelection(`[${displayTitle}](${url})`);
  });
};

export const getTitle = async (url: string) => {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const title = dom.window.document.title;
  return title;
};

export type TitlePattern = {
  url: string;
  pattern: string;
  format: string;
};

export const toDisplayTitle: (titleInfo: {
  title: string;
  url: string;
  titlePatterns: TitlePattern[];
}) => string = (titleInfo) => {
  for (const pattern of titleInfo.titlePatterns) {
    const reurl = new RegExp(pattern.url);
    if (reurl.test(titleInfo.url)) {
      const repattern = new RegExp(pattern.pattern);
      const displayTitle = titleInfo.title.replace(repattern, pattern.format);
      return displayTitle;
    }
  }

  return titleInfo.title;
};
