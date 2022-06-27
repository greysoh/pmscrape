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
    const data = await get(url, {
        headers: {
            "User-Agent": this.useragent,
        },
    });

    const dom: any = new DOMParser().parseFromString(data.data, "text/html");
    const elem: any = dom.getElementById("downloadButton");

    try {
      const urlFinal: string = elem.attributes.href;

      return urlFinal;
    } catch (e) {
      console.error("Download key error!");
      return "";
    }
  }

  async mediaFireParserFolder(url: string): Promise<string> {
    let newUrl: any = url.split("/");
    newUrl = newUrl[newUrl.length - 2];

    const data = await get(`https://www.mediafire.com/api/1.4/folder/get_content.php?r=ltyk&content_type=files&filter=all&order_by=name&order_direction=asc&chunk=1&version=1.5&folder_key=${newUrl}&response_format=json`, {
        headers: {
            "User-Agent": this.useragent,
        },
    });

    try {
      return await this.mediaFireParser(data.data.response.folder_content.files[0].links.normal_download);
    } catch (e) {
      console.error("Download key error!");
      return "";
    }
  }
}
