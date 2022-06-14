import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = async (url: string) => {
  try {
    const title = await getTitle(url);
    return `[${title}](${url})`;
  } catch (error) {
    return url;
  }
};

const getTitle = async (url: string) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.title;
    return title;
  } catch (error) {
    return url;
  }
};
