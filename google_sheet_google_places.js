/**
 * Your Google Maps API Key. Renamed for uniqueness.
 * IMPORTANT: For better security, consider using PropertiesService
 * instead of hardcoding your key directly in the script.
 * See: https://developers.google.com/apps-script/guides/properties
 */
const GMAPS_PLACES_API_KEY = 'PLACES-API-KEY';

/**
 * A specific cache for Google Maps Places results. Renamed for uniqueness.
 */
const gmapsPlacesCache = CacheService.getScriptCache();

/**
 * Fetches place details from Google Maps API with caching.
 * This is the core function to get data.
 *
 * @param {string} placeName The name or description of the place.
 * @param {string} field The specific field(s) to fetch (e.g., 'website', 'photos', 'formatted_phone_number').
 * @return {any} The requested place detail(s) or an error message.
 */
function GMAPS_getPlaceData(placeName, field) {
  if (!placeName) {
    return 'Please provide a place name.';
  }

  const locationBias = "São Paulo, Brasil";
  const input = `${placeName}, ${locationBias}`;
  // Use a cache key based on input and field
  const gmapsCacheKey = 'gmaps_' + input + '_' + field;
  const cached = gmapsPlacesCache.get(gmapsCacheKey);

  if (cached != null) {
    // If cached, we need to parse it back to an object if it was one
    try {
        return JSON.parse(cached);
    } catch(e) {
        return cached; // Return as is if not JSON (e.g., simple strings)
    }
  }

  try {
    // --- Step 1: Find Place ID (Cache this separately) ---
    const placeIdCacheKey = 'gmaps_placeid_' + input;
    let placeId = gmapsPlacesCache.get(placeIdCacheKey);

    if (placeId == null) {
        const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=textquery&fields=place_id&key=${GMAPS_PLACES_API_KEY}`;
        const findPlaceResponse = UrlFetchApp.fetch(findPlaceUrl, { 'muteHttpExceptions': true });
        const findPlaceJson = JSON.parse(findPlaceResponse.getContentText());

        if (findPlaceJson.status !== 'OK' || !findPlaceJson.candidates || findPlaceJson.candidates.length === 0) {
            Logger.log(`GMaps Find Place Error for "${input}": ${findPlaceJson.status} - ${findPlaceJson.error_message || 'No candidates found.'}`);
            return `Error: Could not find place - ${findPlaceJson.status}`;
        }
        placeId = findPlaceJson.candidates[0].place_id;
        gmapsPlacesCache.put(placeIdCacheKey, placeId, 21600); // Cache Place ID for 6 hours
    }

    // --- Step 2: Get Place Details ---
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${field}&key=${GMAPS_PLACES_API_KEY}`;
    const detailsResponse = UrlFetchApp.fetch(detailsUrl, { 'muteHttpExceptions': true });
    const detailsJson = JSON.parse(detailsResponse.getContentText());

    if (detailsJson.status !== 'OK') {
       Logger.log(`GMaps Details Error for Place ID "${placeId}": ${detailsJson.status} - ${detailsJson.error_message || 'Details fetch failed.'}`);
       return `Error: Could not get details - ${detailsJson.status}`;
    }

    const result = detailsJson.result[field];

    if (result === undefined) {
        return 'Not found';
    }

    // Cache the result. Store objects as JSON strings.
    const valueToCache = (typeof result === 'object') ? JSON.stringify(result) : result;
    gmapsPlacesCache.put(gmapsCacheKey, valueToCache, 21600); // Cache for 6 hours

    return result;

  } catch (e) {
    Logger.log(`GMaps Exception for "${input}": ${e}`);
    return `Error: ${e.message}`;
  }
}

/**
 * Gets the website for a given place.
 *
 * @param {string} placeName The name of the place.
 * @return {string} The website URL or an error message.
 * @customfunction
 */
function GMAPS_getWebsite(placeName) {
  return GMAPS_getPlaceData(placeName, 'website');
}

/**
 * Gets the phone number for a given place.
 *
 * @param {string} placeName The name of the place.
 * @return {string} The phone number or an error message.
 * @customfunction
 */
function GMAPS_getPhone(placeName) {
  return GMAPS_getPlaceData(placeName, 'formatted_phone_number');
}

/**
 * Gets the address for a given place.
 *
 * @param {string} placeName The name of the place.
 * @return {string} The address or an error message.
 * @customfunction
 */
function GMAPS_getAddress(placeName) {
  return GMAPS_getPlaceData(placeName, 'formatted_address');
}

/**
 * Gets the URL for the main image of a given place.
 *
 * @param {string} placeName The name of the place.
 * @param {number} [maxWidth=400] Optional. The maximum width of the image.
 * @return {string} The image URL or an error message/Not found.
 * @customfunction
 */
function GMAPS_getImage(placeName, maxWidth) {
  const photosData = GMAPS_getPlaceData(placeName, 'photos');
  const width = maxWidth || 400; // Default to 400 if not provided

  if (typeof photosData === 'string' && photosData.startsWith('Error:')) {
    return photosData; // Return error messages
  }

  if (Array.isArray(photosData) && photosData.length > 0 && photosData[0].photo_reference) {
    const photoReference = photosData[0].photo_reference;
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photoreference=${photoReference}&key=${GMAPS_PLACES_API_KEY}`;
    return imageUrl;
  } else {
    return 'No image found';
  }
}