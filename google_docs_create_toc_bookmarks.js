/**
 * Project Title: Dynamic Table of Contents for Bookmarked Google Docs
 *
 * Functionalities:
 * - Automatically generates a Table of Contents (TOC) at the top of a Google Doc.
 * - Detects user-created bookmarks within the document.
 * - Adds TOC entries for each bookmark with full URL hyperlinks to their respective positions.
 * - Ensures the TOC is neatly formatted and navigable.
 *
 * Specifications:
 * - Input: URL of the Google Doc (defined as a variable in the script).
 * - Output: A clickable TOC at the top of the document with links to each bookmark.
 * - The TOC entries are sequentially numbered and based on the surrounding text of bookmarks.
 *
 * Description:
 * This script helps users organize their Google Docs by generating a clickable Table of Contents 
 * based on bookmarks. Users who create bookmarks to highlight key sections in their document 
 * can use this script to generate an organized TOC, making it easy to navigate directly to any 
 * bookmarked section. Ideal for lengthy documents where quick navigation is essential.
 */

function createTOCFromBookmarks() {
  // Provide the URL of the Google Document
  const docUrl = "YOUR_GOOGLE_DOC_URL_HERE"; // Replace with your Google Doc URL
  
  try {
    // Extract the Document ID from the URL
    const docId = docUrl.match(/[-\w]{25,}/)[0]; // Extracts the part after "/d/" and before "/edit"
    const fullDocUrl = `https://docs.google.com/document/d/${docId}`;

    // Open the document
    const doc = DocumentApp.openById(docId);

    // Get the document body
    const body = doc.getBody();

    // Fetch all bookmarks in the document
    const bookmarks = doc.getBookmarks();

    if (bookmarks.length === 0) {
      Logger.log("No bookmarks found in the document.");
      return;
    }

    // Title for the Table of Contents
    const tocTitle = "Table of Contents\n";
    body.insertParagraph(0, tocTitle).setHeading(DocumentApp.ParagraphHeading.HEADING1);

    // Iterate through bookmarks and create TOC entries
    bookmarks.forEach((bookmark, index) => {
      // Extract text surrounding the bookmark
      const linkedText = bookmark.getPosition().getSurroundingText();
      const linkText = linkedText ? linkedText.getText() : `Bookmark ${index + 1}`;
      const bookmarkId = bookmark.getId();

      // Construct the full URL for the bookmark
      const fullUrl = `${fullDocUrl}#${bookmarkId}`;

      // Create TOC entry
      const tocEntry = `${index + 1}. ${linkText}`;

      // Add TOC entry as a paragraph with hyperlink to the bookmark
      const tocParagraph = body.insertParagraph(index + 1, tocEntry);
      tocParagraph.setLinkUrl(fullUrl);
    });

    Logger.log("Table of Contents created successfully!");
  } catch (e) {
    Logger.log(`Error: ${e.message}`);
  }
}