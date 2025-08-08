function removeLineBreaksFromColumn() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSheet();

  // Prompt the user to input the column letter
  var response = ui.prompt('Choose a column:', 'Enter column letter (e.g., A, B, C):', ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() == ui.Button.OK) {
    var columnLetter = response.getResponseText().trim().toUpperCase();

    // Convert column letter to column number
    var columnNumber = letterToColumn(columnLetter);
    if (!columnNumber) {
      ui.alert('Invalid column letter. Please try again.');
      return;
    }

    var lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      ui.alert('No data found.');
      return;
    }

    var range = sheet.getRange(1, columnNumber, lastRow);
    var values = range.getValues();

    for (var i = 0; i < values.length; i++) {
      if (typeof values[i][0] === 'string') {
        values[i][0] = values[i][0].replace(/[\r\n]+/g, ' '); // Replace line breaks with a space
      }
    }

    range.setValues(values);
    ui.alert('Line breaks removed from column ' + columnLetter + '!');
  } else {
    ui.alert('Operation cancelled.');
  }
}

// Helper function to convert column letter to column number
function letterToColumn(letter) {
  var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var column = 0;

  for (var i = 0; i < letter.length; i++) {
    column *= 26;
    var charIndex = base.indexOf(letter[i]);
    if (charIndex === -1) {
      return null;
    }
    column += charIndex + 1;
  }

  return column;
}