import get from "https://deno.land/x/axiod/mod.ts";
import { lookup, getLookupSource } from "./lookupTbl.ts";
import { download } from "./download.ts";

import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const type: string = Deno.args[0] || "All";
const page: number = parseInt(Deno.args[1]) || 1;
const useragent: string =
  Deno.args[2] ||
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0";

if (type == "help") {
    console.log(
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

    Deno.exit(0);
}

if (type == "listversions") {
    const lookup: string[] = getLookupSource();

    for (let i = 0; i < lookup.length; i++) {
        console.log("- " + lookup[i]);
    }
    
    Deno.exit(0);
}

console.log(`To get help, run: pmd help`);
console.log(`Creating folder...`);

try {
  Deno.mkdirSync("out");
} catch (err) {}

console.log(`Looking up '${type}'...`);

const url: string = lookup(type);

console.log(`Found texture pack type for '${type}' at '${url + "&p=" + page}'`);
console.log(`Getting list of options...`);

const htmlJSON: any = await get(url + "&p=" + page, {
  headers: {
    "User-Agent": useragent,
  },
});

console.log(`Parsing data...`);

const dom: any = new DOMParser().parseFromString(htmlJSON.data, "text/html");

console.log(`Finding pages...`);

for (var i = 0; i < dom.getElementsByClassName("resource r-data").length; i++) {
  const element: any = dom.getElementsByClassName("resource r-data")[i];
  const data: any = element.getElementsByClassName("r-title")[0];

  const href: string = data.attributes.href;

  console.log(`Found page '${data.innerText}' at '${href}'`);
  console.log(`Waiting 3 seconds to not reach the rate limit...`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Getting page '${data.innerText}'...`);

  const newHtmlJSON: any = await get("https://www.planetminecraft.com" + href, {
    headers: {
      "User-Agent": useragent,
    },
  });

  console.log(`Parsing data...`);

  const newDOM: any = new DOMParser().parseFromString(
    newHtmlJSON.data,
    "text/html"
  );
  const newURL: string =
    newDOM.getElementsByClassName("branded-download")[0].attributes.href;

  console.log(`Found unparsed texture pack URL for '${type}' at '${newURL}'`);

  if (newURL.includes("/file/")) {
    // PlanetMinecraft mirror, we need to parse that
    const parsedURL: any = await get(
      "https://www.planetminecraft.com" + newURL,
      {
        headers: {
          "User-Agent": useragent,
        },
      }
    );

    const garbagio: any = new DOMParser().parseFromString(
      parsedURL.data,
      "text/html"
    );

    const newNewURL: string =
      garbagio.getElementById("prerollDownload").attributes.href;

    console.log(
      `Found parsed texture pack URL for '${type}' at '${newNewURL}'`
    );
    console.log(`Downloading...`);

    await download(
      newNewURL,
      "out/" + newNewURL.split("/")[newNewURL.split("/").length - 1]
    );

    console.log(`Downloaded.`);
  } else {
    const parsedURL: any = await get(
      "https://www.planetminecraft.com" + newURL,
      {
        headers: {
          "User-Agent": useragent,
        },
      }
    );

    const url: string = parsedURL.data.forward_url;

    console.log(`Found parsed texture pack URL for '${type}' at '${url}'`);

    console.log(`Downloading...`);

    await download(
      url,
      "out/" + data.innerText.replace(/[^a-z0-9]/gi, '_') + ".zip"
    );

    console.log(`Downloaded.`);
  }
}

console.log("Done.");