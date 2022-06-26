import get from "https://deno.land/x/axiod/mod.ts";
import { lookup, getLookupSource } from "./lookupTbl.ts";
import { download } from "./download.ts";
import { ConsoleLogger } from "https://deno.land/x/unilogger@v1.0.3/mod.ts";

import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const log = new ConsoleLogger({
    tag_string: "{name} |",
    tag_string_fns: {
      name: () => "Init",
    },
  });

const type: string = Deno.args[0] || "All"; // Get the type of texture pack to search for
const page: number = parseInt(Deno.args[1]) || 1; // Get the page number to search for
const useragent: string = 
  Deno.args[2] ||
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0"; // Get the user agent to use

if (type == "help") { // If the type is help,
    console.log( // we show the help message,
        "Usage: pmd [type: optional] [page: optional] [useragent: optional]\n" +
        "You can also use the following debug options:\n" +
        " - type = listversions: list all versions available\n\n" +
        "Example: pmd All 1\n" +
        "Example: pmd 1.16.1\n" +
        "Example: pmd 1.16.1 1\n" +
        "Example: pmd 1.16.1 1 \"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0\"\n\n" +
        "Types:\n" +
        " - optional: you probably should use, version number (default: All)\n" +
        " - page: page number (default: 1)\n" + 
        " - useragent: useragent to use (default: Firefox v101.0)\n" + 
        "   - Full useragent in use:\n" + 
        "     - " + useragent
    );

    Deno.exit(0); // then exit.
}

if (type == "listversions") { // Else, if the type is "listversions",
    const lookup: string[] = getLookupSource(); // we get the list of versions available,

    for (let i = 0; i < lookup.length; i++) {
        console.log("- " + lookup[i]); // list them,
    }
    
    Deno.exit(0); // and exit.
}

console.log(`To get help, run: pmd help`); // We then show the help message,
log.info(`Creating folder...`); // and we create the folder.

try {
  Deno.mkdirSync("out"); // Then, we try to make the folder.
} catch (err) {}

log.info(`Looking up '${type}'...`);

const url: string = lookup(type); // We get the URL to search for,

log.info(`Found texture pack type for '${type}' at '${url + "&p=" + page}'`); // show the URL,
log.info(`Getting list of options...`); // and we get the list of options.

const htmlJSON: any = await get(url + "&p=" + page, { // We get the HTML,
  headers: { // with the headers,
    "User-Agent": useragent,
  },
});

log.info(`Parsing data...`); // and we parse the data.

const dom: any = new DOMParser().parseFromString(htmlJSON.data, "text/html"); // We parse the HTML,

log.info(`Finding pages...`); // and we find the pages.

for (var i = 0; i < dom.getElementsByClassName("resource r-data").length; i++) { // We loop through the pages,
    const log = new ConsoleLogger({
        tag_string: "{name} |",
        tag_string_fns: {
          name: () => "InitialParser",
        },
      }); // initialize the logger,
  const element: any = dom.getElementsByClassName("resource r-data")[i]; // and we get the element.
  const data: any = element.getElementsByClassName("r-title")[0]; // We get the data,

  const href: string = data.attributes.href; // href,

  log.info(`Found page '${data.innerText}' at '${href}'`); // show the page,
  log.info(`Waiting 1 second to not reach the rate limit...`); // and we wait 1 second.

  await new Promise((resolve) => setTimeout(resolve, 1000));

  log.info(`Getting page '${data.innerText}'...`); // Then we get the page for that page,

  const newHtmlJSON: any = await get("https://www.planetminecraft.com" + href, { // with the headers,
    headers: {
      "User-Agent": useragent,
    },
  });

  log.info(`Parsing data...`); // and we parse the data.

  const newDOM: any = new DOMParser().parseFromString( // We parse the HTML,
    newHtmlJSON.data,
    "text/html"
  );

  const newURL: string = // We get the URL,
    newDOM.getElementsByClassName("branded-download")[0].attributes.href;

  log.info(`Found unparsed texture pack URL for '${type}' at '${newURL}'`); // show the URL,

  if (newURL.includes("/file/")) { // and if the URL contains "/file/", it is a direct download,
    // "Rant" here:
    // And even though it sucks to parse this,
    // It ACTUALLY WORKS.
    //
    // I'm not sure *WHY* people want to link to videos,
    // like, we get it, it looks good.
    //
    // And, money hungry people use ad urls to get money,
    // despite ad blockers existing.
    //
    // And people use mediafire and mega.nz. 
    // Why??
    // There is *NO* point,
    // and it's less of a hassle to just use direct download.
    // *sigh* 
    //
    // Anyways, bodgeParser.ts should solve this.

    // Anyways, we get the direct download URL,

    const log = new ConsoleLogger({
        tag_string: "{name} |",
        tag_string_fns: {
          name: () => "DirectDownloadParser",
        },
      });

    const parsedURL: any = await get(
      "https://www.planetminecraft.com" + newURL,
      {
        headers: { // with the headers,
          "User-Agent": useragent,
        },
      }
    );

    const garbagio: any = new DOMParser().parseFromString(
      parsedURL.data, // and we parse the HTML,
      "text/html"
    );

    const newNewURL: string = // then get the actual url.
      garbagio.getElementById("prerollDownload").attributes.href;

    log.info( // then, we download the file.
      `Found parsed texture pack URL for '${type}' at '${newNewURL}'`
    );
    
    log.info(`Downloading...`);

    await download(
      newNewURL,
      "out/" + newNewURL.split("/")[newNewURL.split("/").length - 1]
    );

    log.info(`Downloaded.`);
  } else {
    const log = new ConsoleLogger({
        tag_string: "{name} |",
        tag_string_fns: {
          name: () => "CustomPathParser",
        },
      });

    const parsedURL: any = await get(
      "https://www.planetminecraft.com" + newURL,
      {
        headers: {
          "User-Agent": useragent,
        },
      }
    );

    const url: string = parsedURL.data.forward_url;

    log.info(`Found parsed texture pack URL for '${type}' at '${url}'`);

    log.error("This texture pack is not a direct download.");
    log.error("Saving incompatible notice in the out directory, with the link.");

    await Deno.writeTextFile("out/" + data.innerText.replace(/[^a-z0-9]/gi, '_') + "_INCOMPATIBLE.txt", "URL: " + url);
  }
}

log.info("Done.");