import axios from "axios";

import { JSDOM } from "jsdom";
import { format } from "path";

import { LinkPart } from "./extension";

export const urlToLink = (
  url: string,
  titlePatterns: TitlePattern[],
  linkFormat: string,
  replaceSelection: (text: string) => void
) => {
  return getTitle(url).then((title) => {
    const displayTitle = toDisplayTitle({ title, url, titlePatterns });
    const linkText = formatLinkText(displayTitle, url, linkFormat);
    replaceSelection(linkText);
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
  titlePattern: string;
  titleFormat: string;
};

export const toDisplayTitle: (titleInfo: {
  title: string;
  url: string;
  titlePatterns: TitlePattern[];
}) => string = (titleInfo) => {
  for (const pattern of titleInfo.titlePatterns) {
    const reurl = new RegExp(pattern.url);
    if (reurl.test(titleInfo.url)) {
      const repattern = new RegExp(pattern.titlePattern);
      const displayTitle = titleInfo.title.replace(
        repattern,
        pattern.titleFormat
      );
      return displayTitle;
    }
  }

  return titleInfo.title;
};

export const formatLinkText: (
  displayTitle: string,
  url: string,
  format: string
) => string = (displayTitle: string, url: string, format: string) => {
  const linkText = format
    .replace("${title}", displayTitle)
    .replace("${url}", url);
  return linkText;
};
