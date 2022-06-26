
// For all the insane people who don't use direct downloads.
// This gets the URL for all the weird platforms that people use.

// Permanently unsupported:
//  - YouTube/Video Streams 
// Supported:
//  - Direct Downloads (obviously)
// Planned:
//  - Mediafire
//  - Google Drive

export default class BodgeParser {
    /**
     * Sets up the parser.
     * @param useragent The useragent to use.
     */
    constructor(useragent: string) {
        this.useragent = useragent;
    }

    /**
     * 
     * @param url The URL to parse.
     * @returns {Promise<string>} The direct download URL, blank string if failed.
     */
    async parse(url: string): Promise<string> { 
        // If else hell.
        // Sorry.

        if (url.startsWith("https://drive.google.com/")) {
            return await this.driveParser(url);
        } else {
            return "";
        }
    }

    async driveParser(url: string): Promise<string> {
        // Placeholder.
    }
}