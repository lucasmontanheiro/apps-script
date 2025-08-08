/**
 * Google Apps Script: Custom Google Sheets Formulas for Google Maps Geocoding
 * 
 * Purpose:
 * - `GOOGLEMAPSLAT`: Retrieves the latitude of a location from Google Maps.
 * - `GOOGLEMAPSLONG`: Retrieves the longitude of a location from Google Maps.
 * 
 * Features:
 * - Allows optional restriction to a specific area using an additional argument.
 * - Uses Google Maps Geocoding API.
 * - Provides error handling for invalid locations or API issues.
 * 
 * Setup:
 * 1. Obtain a Google Maps Geocoding API key from the Google Cloud Console.
 * 2. Replace `YOUR_API_KEY` with your actual API key in the code below.
 * 
 * Usage in Google Sheets:
 * - `=GOOGLEMAPSLAT("location text", "restrict area")`
 * - `=GOOGLEMAPSLONG("location text", "restrict area")`
 * 
 * Note:
 * This script requires the Google Maps Geocoding API to be enabled in the Google Cloud Console.
 */

// Replace with your Google Maps API Key
const API_KEY = 'API-KEY';

// =GOOGLEMAPSLAT(C9, "Brazil")

/**
 * Retrieves the latitude of a given location.
 * @param {string} location - The location to search (e.g., "New York").
 * @param {string} [restrictArea] - Optional area restriction (e.g., "USA", "Brazil").
 * @return {number|string} - Latitude of the location or an error message.
 */
function GOOGLEMAPSLAT(location, restrictArea) {
  const geocodeResult = geocodeLocation(location, restrictArea);
  if (geocodeResult.error) {
    return `Error: ${geocodeResult.error}`;
  }
  return geocodeResult.lat;
}

/**
 * Retrieves the longitude of a given location.
 * @param {string} location - The location to search (e.g., "New York").
 * @param {string} [restrictArea] - Optional area restriction (e.g., "USA").
 * @return {number|string} - Longitude of the location or an error message.
 */
function GOOGLEMAPSLONG(location, restrictArea) {
  const geocodeResult = geocodeLocation(location, restrictArea);
  if (geocodeResult.error) {
    return `Error: ${geocodeResult.error}`;
  }
  return geocodeResult.lng;
}

/**
 * Helper function to perform geocoding using Google Maps API.
 * @param {string} location - The location to search.
 * @param {string} [restrictArea] - Optional area restriction.
 * @return {Object} - Object containing lat, lng, or error information.
 */
function geocodeLocation(location, restrictArea) {
  try {
    // Build the API URL
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const queryParams = {
      address: location,
      key: API_KEY,
    };
    if (restrictArea) {
      queryParams.components = `country:${restrictArea}`;
    }

    const url = `${baseUrl}?${Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')}`;

    // Fetch and parse the API response
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());

    if (json.status !== 'OK') {
      return { error: `API Error: ${json.status}` };
    }

    // Extract latitude and longitude from the response
    const locationData = json.results[0]?.geometry?.location;
    if (!locationData) {
      return { error: 'Location not found.' };
    }

    return {
      lat: locationData.lat,
      lng: locationData.lng,
    };
  } catch (error) {
    return { error: `Unexpected Error: ${error.message}` };
  }
}
