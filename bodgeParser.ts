// For all the insane people who don't use direct downloads.
// This gets the URL for all the weird platforms that people use.

// Permanently unsupported:
//  - YouTube/Video Streams
//  - Small sites
//  - Patreon
// Supported:
//  - Direct Downloads (obviously)
//  - Mediafire
// Planned:
//  - Google Drive

import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { ConsoleLogger } from "https://deno.land/x/unilogger@v1.0.3/mod.ts";
import get from "https://deno.land/x/axiod/mod.ts";

export default class BodgeParser {
  /**
   * Sets up the parser.
   * @param useragent The useragent to use.
   */
  constructor(useragent: string) {
    this.useragent = useragent;
    this.logger = new ConsoleLogger({
      tag_string: "{name} |",
      tag_string_fns: {
        name: () => "BodgeParser",
      },
    });
  }

  useragent: string;
  logger: any;

  /**
   *
   * @param url The URL to parse.
   * @returns {Promise<string>} The direct download URL, blank string if failed.
   */
  async parse(url: string): Promise<string> {
    // If else hell.
    // Sorry.

    this.logger.info("Sorting URL: " + url);

    if (url.startsWith("https://www.mediafire.com/file/")) {
      return await this.mediaFireParser(url);
    } else if (url.startsWith("https://www.mediafire.com/folder/")) {
      return await this.mediaFireParserFolder(url);
    } else if (
      url.startsWith("http://adfoc.us") ||
      url.startsWith("https://adfoc.us")
    ) {
      return await this.adfocusParser(url);
    } else {
      this.logger.error("Unknown URL: " + url);
      return "";
    }
  }

  async adfocusParser(url: string): Promise<string> {
    this.logger.info("Parsing shortened URL (Adfoc.us): " + url);

    const data = await get(url, {
      headers: {
        "User-Agent": this.useragent,
        Accept:
          "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    const dom: any = new DOMParser().parseFromString(data.data, "text/html");
    const elem: any = dom
      .getElementById("showSkip")
      .getElementsByTagName("a")[0];

    this.logger.info("Redirecting...");
    return await this.parse(elem.attributes.href); // It's shortened for a reason.
  }

  async mediaFireParser(url: string): Promise<string> {
    this.logger.info("Parsing URL (MediaFire): " + url);
    const data = await get(url, {
      headers: {
        "User-Agent": this.useragent,
      },
    });

    const dom: any = new DOMParser().parseFromString(data.data, "text/html");
    const elem: any = dom.getElementById("downloadButton");

    try {
      const urlFinal: string = elem.attributes.href;

      this.logger.info("URL is " + url);
      return urlFinal;
    } catch (e) {
      this.logger.error("Download key error!");
      return "";
    }
  }

  async mediaFireParserFolder(url: string): Promise<string> {
    this.logger.info("Parsing URL (MediaFire Folder): " + url);
    let newUrl: any = url.split("/");
    newUrl = newUrl[newUrl.length - 2];

    const data = await get(
      `https://www.mediafire.com/api/1.4/folder/get_content.php?r=ltyk&content_type=files&filter=all&order_by=name&order_direction=asc&chunk=1&version=1.5&folder_key=${newUrl}&response_format=json`,
      {
        headers: {
          "User-Agent": this.useragent,
        },
      }
    );

    try {
      this.logger.info("1st entry of folder in URL: " + url);
      this.logger.info("Forwarding to the mediafire file parser...");

      return await this.mediaFireParser(
        data.data.response.folder_content.files[0].links.normal_download
      );
    } catch (e) {
      console.error("Download key error!");
      return "";
    }
  }
}
