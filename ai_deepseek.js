/**
 * Creates a custom menu in the spreadsheet UI to set the API key.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 DeepSeek AI')
    .addItem('Set API Key', 'setApiKey')
    .addToUi();
}

/**
 * Prompts the user to enter their DeepSeek API key and stores it securely
 * in User Properties, scoped to the current user.
 */
function setApiKey() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    'Set DeepSeek API Key',
    'Please enter your DeepSeek API key. It will be stored securely for your account only.',
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() == ui.Button.OK) {
    const apiKey = prompt.getResponseText();
    if (apiKey && apiKey.trim() !== '') {
      // Store the key securely in a per-user property.
      PropertiesService.getUserProperties().setProperty('DEEPSEEK_API_KEY', apiKey);
      ui.alert('Success!', 'Your DeepSeek API key has been saved.', ui.ButtonSet.OK);
    } else {
      ui.alert('Error', 'API Key cannot be empty.', ui.ButtonSet.OK);
    }
  }
}

/**
 * Queries the DeepSeek API with a given prompt.
 *
 * @param {string} prompt The text prompt to send to the AI model.
 * @return {string} The text response from the DeepSeek API.
 * @customfunction
 */
function DEEPSEEK(prompt) {
  // 1. Input Validation
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return "Error: Please provide a valid text prompt.";
  }

  // 2. Retrieve API Key
  const apiKey = PropertiesService.getUserProperties().getProperty('DEEPSEEK_API_KEY');
  if (!apiKey) {
    return "Error: API key not set. Please use the '🤖 DeepSeek AI > Set API Key' menu.";
  }

  // 3. Prepare the API Request
  const url = 'https://api.deepseek.com/chat/completions';
  const payload = {
    model: 'deepseek-chat', // Or 'deepseek-coder' for coding tasks
    messages: [{
      role: 'user',
      content: prompt
    }],
    stream: false // Important for a simple request-response
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Prevents script failure on API errors (e.g., 401, 500)
  };

  // 4. Execute the API Call and Handle Response
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode === 200) {
      const jsonResponse = JSON.parse(responseBody);
      // Extract the text content from the response object
      return jsonResponse.choices[0].message.content.trim();
    } else {
      // Return a descriptive error if the API call fails
      return `Error ${responseCode}: ${responseBody}`;
    }
  } catch (e) {
    return "Error: " + e.toString();
  }
}