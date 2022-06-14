import axios from "axios";

import { JSDOM } from "jsdom";

export const urlToLink = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.title;
    return `[${title}](${url})`;
  } catch (error) {
    return url;
  }
};
