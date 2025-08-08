function resetAllColumnWidths() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var numColumns = sheet.getMaxColumns();
  
  for (var col = 1; col <= numColumns; col++) {
    sheet.setColumnWidth(col, 100); // 100 is the default width in pixels
  }
}
