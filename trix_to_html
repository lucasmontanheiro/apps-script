// code.gs
function doGet() {
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  html.setTitle("set title");
  return html; 
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function getData(){
  var sheet = SpreadsheetApp.openById("").getSheets()[0]; // Google Spreadsheet URL
  return sheet.getDataRange().getValues();
}
