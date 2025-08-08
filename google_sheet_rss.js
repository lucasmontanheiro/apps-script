/***********************************************
 * Title: RSS Feed Aggregator to Google Sheets
 * Description:
 * This script fetches, aggregates, and sorts RSS feeds 
 * from multiple sources (YouTube, Others) in descending 
 * order by date, and populates a specified Google Sheet tab 
 * with relevant data like Title, Source, Platform, Link, Date, and Time.
 * 
 * Purpose: 
 * Automate RSS feed aggregation for analytics or reporting.
 *
 * Usage: 
 * - Provide the Google Sheet URL and tab name.
 * - Update the `RSS_FEEDS` array with your feed URLs and platform types.
 *
 * Prompt Used:
 * "Create a Google App Script code that aggregates RSS feeds, sorted by DESC 
 * (recent first) and populates a Google Sheet tab (URL and parameters provided 
 * by me) with title, source name, source platform (YouTube, Others), link, date, 
 * and time. You're an experienced developer who documents all functions and 
 * sections of the code, explaining their purpose and implementation clearly. 
 * Write modular, reusable code that adheres to DRY principles."
 ***********************************************/
/***********************************************
 * Enhanced RSS Feed Aggregator with Content and Author
 ***********************************************/

/***********************************************
 * Enhanced RSS Feed Aggregator with Cleaned Content and Author
 ***********************************************/

const RSS_FEEDS = [
  { url: "https://www.google.com.br/alerts/feeds/04594274413169544206/16978264240944516861", name: "Google Alerts", platform: "Aggregator" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCwpyuvmJ_mOrebYbUPXtaBQ", name: "Meu Timão", platform: "YouTube" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXSYz2vDsxEEcRz998QqN3g", name: "Canal do Povo", platform: "YouTube" }
];

const SHEET_URL = "SHEET-URL"; // Replace with your Sheet URL
const SHEET_TAB_NAME = "RSS Aggregator";   // Replace with the desired tab name

function aggregateRssFeeds() {
  const data = fetchAndProcessFeeds();
  if (data.length === 0) {
    console.log("No feed items to populate.");
    return;
  }

  const sortedData = sortFeedsByDateDesc(data);
  populateSheet(sortedData);
}

function fetchAndProcessFeeds() {
  let feedItems = [];

  RSS_FEEDS.forEach(feed => {
    console.log(`Fetching RSS feed: ${feed.name} (${feed.platform})`);
    const rssXml = fetchRss(feed.url);

    if (rssXml) {
      const parsedItems = parseRss(rssXml, feed.name, feed.platform);
      feedItems = feedItems.concat(parsedItems);
    } else {
      console.warn(`Failed to fetch or parse RSS feed: ${feed.url}`);
    }
  });

  console.log(`Total feed items fetched: ${feedItems.length}`);
  return feedItems;
}

function fetchRss(url) {
  try {
    const response = UrlFetchApp.fetch(url);
    return response.getContentText();
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}: ${error.message}`);
    return null;
  }
}

function parseRss(rssXml, sourceName, platform) {
  try {
    const document = XmlService.parse(rssXml);
    const root = document.getRootElement();

    // Handle namespaces
    const atomNamespace = root.getNamespace();
    const entries = root.getChildren("entry", atomNamespace); // Use namespace for Atom feeds

    console.log(`Found ${entries.length} entries in feed: ${sourceName}`);

    return entries.map(entry => {
      let title = getChildText(entry, "title", atomNamespace) || "No Title";
      let link = getLink(entry, atomNamespace);
      let pubDate = getChildText(entry, "published", atomNamespace) || getChildText(entry, "updated", atomNamespace) || "1970-01-01";
      let content = getChildText(entry, "content", atomNamespace) || getChildText(entry, "summary", atomNamespace) || "No Content";
      let author = getChildText(entry, "author", atomNamespace) || "No Author";
      
      // Clean HTML from title and content
      title = cleanHtml(title);
      content = cleanHtml(content);

      const { date, time } = parseDateTime(pubDate);

      return { title, sourceName, platform, link, date, time, content, author };
    });
  } catch (error) {
    console.error(`Error parsing RSS feed for source: ${sourceName}. Error: ${error.message}`);
    return [];
  }
}

function cleanHtml(html) {
  // Remove HTML tags using regex
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

function getLink(entry, namespace) {
  // For Atom feeds, <link> is an attribute
  const linkElement = entry.getChild("link", namespace);
  if (linkElement && linkElement.getAttribute("href")) {
    return linkElement.getAttribute("href").getValue();
  }
  return "No Link";
}

function sortFeedsByDateDesc(feedItems) {
  return feedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function populateSheet(data) {
  const sheet = getSheet();
  sheet.clear(); // Clear existing data

  // Write header
  const headers = [
    "Title",
    "Source Name",
    "Source Platform",
    "Link",
    "Date",
    "Time",
    "Content",
    "Author"
  ];
  sheet.appendRow(headers);

  // Write rows
  data.forEach(item => {
    if (item.title && item.link) { // Ensure data integrity before writing
      sheet.appendRow([
        item.title,
        item.sourceName,
        item.platform,
        item.link,
        item.date,
        item.time,
        item.content,
        item.author
      ]);
    }
  });

  console.log(`Successfully populated ${data.length} rows to the sheet.`);
}

function parseDateTime(dateTime) {
  try {
    const date = new Date(dateTime);
    const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
    const formattedTime = Utilities.formatDate(date, Session.getScriptTimeZone(), "HH:mm:ss");
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error(`Error parsing date-time: ${dateTime}. Error: ${error.message}`);
    return { date: "1970-01-01", time: "00:00:00" }; // Default date/time
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
  let sheet = spreadsheet.getSheetByName(SHEET_TAB_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_TAB_NAME);
  }

  return sheet;
}

function getChildText(parent, tagName, namespace) {
  const child = parent.getChild(tagName, namespace);
  return child ? child.getText() : null;
}