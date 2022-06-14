import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = (
  url: string,
  replaceSelection: (text: string) => void
) => {
  getTitle(url).then((title) => {
    replaceSelection(`[${title}](${url})`);
  });
};

export const getTitle = async (url: string) => {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const title = dom.window.document.title;
  return title;
};
