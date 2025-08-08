function getApiKey() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  //return sheet.getRange('API_KEY').getValue(); // Named range 'API_KEY'
  return 'API_KEY';
}

var cache = {};

function OPENAI_CHAT(prompt, system = "", temperature = 0) {
  var cacheKey = prompt + system + temperature;
  if (cache[cacheKey]) {
    return cache[cacheKey]; // Return cached response
  }

  var apiKey = getApiKey();
  var conversation = [
    { 
      role: "system", 
      content: system,
    },
    { 
      role: "user", 
      content: prompt,
    },
  ];

  var body = {
    model: "gpt-3.5-turbo", // Cheaper model
    messages: conversation,
    temperature: temperature,
    max_tokens: 3000, // Reduced token limit
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(body),
    'headers': {
      Authorization: 'Bearer ' + apiKey,
    },
  };

  try {
    var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', options);
    var json = JSON.parse(response.getContentText());
    var result = json.choices[0].message.content;
    cache[cacheKey] = result; // Cache the result
    return result;
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return "Error: Failed to generate response.";
  }
}