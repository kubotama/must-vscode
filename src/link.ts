import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = (
  url: string,
  titlePatterns: TitlePattern[],
  urlPatterns: UrlPattern[],
  linkFormat: string
) => {
  return getTitle(url)
    .then((title) => {
      const displayTitle = toDisplayTitle({ title, url, titlePatterns });
      const displayUrl = toDisplayUrl(url, urlPatterns);
      const linkText = toLinkText(displayTitle, displayUrl, linkFormat);
      return linkText;
    })
    .catch((error) => {
      throw error;
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
  const pattern = titleInfo.titlePatterns.find((pattern) => {
    const reUrl = new RegExp(pattern.url);
    return reUrl.test(titleInfo.url);
  });
  if (pattern) {
    const rePattern = new RegExp(pattern.pattern);
    return titleInfo.title.replace(rePattern, pattern.format);
  }

  return titleInfo.title;
};

export const toLinkText: (
  displayTitle: string,
  url: string,
  format: string
) => string = (displayTitle: string, url: string, format: string) => {
  const linkText = format
    .replace("${title}", displayTitle)
    .replace("${url}", url);
  return linkText;
};

export type UrlPattern = {
  url: string;
  format: string;
};

export const toDisplayUrl: (
  url: string,
  urlPatterns: UrlPattern[]
) => string = (url: string, urlPatterns: UrlPattern[]) => {
  const urlPattern = urlPatterns.find((urlPattern) => {
    const reUrl = new RegExp(urlPattern.url);
    return reUrl.test(url);
  });
  if (urlPattern) {
    const formatUrl = urlPattern.format;
    const reUrl = new RegExp(urlPattern.url);
    const displayUrl = url.replace(reUrl, formatUrl);
    return displayUrl;
  }
  return url;
};
