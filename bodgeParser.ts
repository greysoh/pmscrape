// For all the insane people who don't use direct downloads.
// This gets the URL for all the weird platforms that people use.

// Permanently unsupported:
//  - YouTube/Video Streams
// Supported:
//  - Direct Downloads (obviously)
// Planned:
//  - Mediafire
//  - Google Drive

import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import get from "https://deno.land/x/axiod/mod.ts";

export default class BodgeParser {
  /**
   * Sets up the parser.
   * @param useragent The useragent to use.
   */
  constructor(useragent: string) {
    this.useragent = useragent;
  }

  useragent: string;

  /**
   *
   * @param url The URL to parse.
   * @returns {Promise<string>} The direct download URL, blank string if failed.
   */
  async parse(url: string): Promise<string> {
    // If else hell.
    // Sorry.

    if (url.startsWith("https://www.mediafire.com/file/")) {
      return await this.mediaFireParser(url);
    } else if (url.startsWith("https://www.mediafire.com/folder/")) {
      return await this.mediaFireParserFolder(url);
    } else {
      return "";
    }
  }

  async mediaFireParser(url: string): Promise<string> {
    // Placeholder.

    const data = await get(url, {
        headers: {
            "User-Agent": this.useragent,
        },
    });

    const dom: any = new DOMParser().parseFromString(data.data, "text/html");
    const elem: any = dom.getElementById("downloadButton");
    const urlFinal: string = elem.attributes.href;

    return urlFinal;
  }

  async mediaFireParserFolder(url: string): Promise<string> {
    // Placeholder.
    return "";
  }
}
