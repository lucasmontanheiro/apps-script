# apps-script

Collection of App Scripts for Google Dirve documents and sheets.

## Scripts

### 01_Basics.js
Contains basic JavaScript functions like temperature conversion and summation.

### count_words_in_google_docs.js
Counts words in a Google Doc and updates a Google Spreadsheet with the count. It also has a function to find and highlight specific words.

### remove_line_breaks.js
Removes line breaks from a specific column in a Google Sheet.

### trix_to_email.js
Reads data from a Google Sheet, filters it, and sends an email with the filtered data.

### trix_to_html.js
Creates a web app that displays data from a Google Sheet in an HTML table.

### ai_openai.js
Provides a function to interact with the OpenAI API's chat completions endpoint.

### google_sheet_google_maps.js
Contains custom functions to retrieve latitude and longitude from Google Maps using the Geocoding API.

### google_sheet_google_places.js
Includes functions to fetch place details (website, phone, address, image) from the Google Maps Places API.

### google_sheet_remove_line_breaks.js
Removes line breaks from a user-specified column in a Google Sheet.

### google_sheet_resetColumnWidths.js
Resets the width of all columns in a Google Sheet to the default value.

### google_docs_count_words.js
Counts words in a Google Doc and updates a Google Spreadsheet with the count. It also has a function to find and highlight specific words.

### google_docs_create_toc_bookmarks.js
Automatically generates a Table of Contents (TOC) at the top of a Google Doc from bookmarks.

### google_sheet_rss.js
Fetches, aggregates, and sorts RSS feeds from multiple sources and populates a Google Sheet tab with the data.

### google_sheet_to_email.js
Reads data from a Google Sheet, filters it, and sends an email with the filtered data.

### google_sheet_to_html.js
Creates a web app that displays data from a Google Sheet in an HTML table.

## Security Warning

Several scripts in this repository contain placeholder API keys or URLs. Before using these scripts, you must replace the placeholder values with your actual API keys and URLs. For better security, it is highly recommended to use the [Google Apps Script Properties Service](https://developers.google.com/apps-script/guides/properties) to store your API keys instead of hardcoding them directly in the scripts.