// These functions count words in a Google Doc and update a Google Spreadsheet

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Script')
  .addItem('Update Count Trix', 'myFunction')
  .addItem('Update Section Count', 'countPerSection')
  .addItem('Show sidebar', 'showSidebar')
  .addToUi();
}

// Show sidebar in Google Doc
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('page')
  .setTitle('My custom sidebar')
  .setWidth(300);
  SpreadsheetApp.getUi()
  .showSidebar(html);
}


/* 
*** FIND WORDS *** 
*/

function findWordsAndHighlight(term) {
  
  var doc = DocumentApp.openById(""); // Google Doc URL
  var text = doc.editAsText();
  var search = term;
  var search_count = 0;
  var index = -1;
  var color ="#2577ba";
  var textLength = search.length-1;

while(true)
{
  index = text.getText().indexOf(search,index+1);
  if(index == -1)
    break;
  else { 
    text.setForegroundColor(index, index+textLength,color );
    search_count = search_count + 1;
  }
}

  Logger.log(search_count);
  var trix = SpreadsheetApp.openById(""); // Google Spreadsheet to be updated with word count
  var tab = trix.getSheetByName("tags")
  tab.appendRow([search, search_count]);
  
  return search_count;
  
};

/* 
*** MAIN FUNCTION *** 
*/

function myFunction() {
  var DS_text = DocumentApp.openById('').getBody().getText(); // Google Doc URL
  var DS_words = DS_text.match(/\S+/g);
  
 //
  
  var trix = SpreadsheetApp.openById(''); // Google Spreadsheet to be updated with word count
  var sheet = trix.getSheetByName('books');
  var day = Utilities.formatDate(new Date(), "GMT-8", "MM-dd-yyyy");
   
  sheet.appendRow([day, 60000, DS_words.length, TW_words.length, , , , findWordsAndHighlight("[name1]"),findWordsAndHighlight("[name2]"),findWordsAndHighlight("[name3]"),findWordsAndHighlight("[name4]")]);
  
}
