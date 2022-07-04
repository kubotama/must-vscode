import axios from "axios";

import { JSDOM } from "jsdom";

/**
 * return created link text from link
 * @param {string} url - url to create link
 * @param {TitlePattern[]} titlePatterns - title formats for each url pattern
 * @param {UrlPattern[]} urlPatterns - url formats for each url patterns
 * @param {string} linkFormat - link format for each language
 * @returns {Promise<string>} created link text
 */
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

/**
 * return title of url
 * @param {string} url - url to get the title
 * @returns {Promise<string>} title text
 */
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

/**
 * convert title based on title patterns
 * @param titleInfo
 * @returns title converted based on title patterns
 */
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

/**
 * create link text based on title and url based on format
 * @param {string} displayTitle - title text converted by title patterns
 * @param {string} url - url to create a link
 * @param {string} format - format to create a link
 * @returns {string} created link text
 */
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

/**
 * convert url based on url patterns
 * @param {string} url -
 * @param urlPatterns
 * @returns {string} url converted based on url patterns
 */
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
