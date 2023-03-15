const API_VERSION = 'v1alpha';
const BASE_URL = `https://admob.googleapis.com/${API_VERSION}/accounts/`;
const RESOURCE_PATH_MAP = {
  'adUnitMappings': 'adUnits',
  'adapters': 'adSources',
};
const MUTE_HTTP_EXCEPTIONS = {
  'get': false,
  'post': false,
  'patch': false,
};

/**
 * Builds a complete URL from a base URL and a map of URL parameters.
 * @param {string} BASE_URL The base URL.
 * @param {!Object.<string, string>} params The URL parameters and values.
 * @return {string} The complete URL.
 * @private
 */
function buildUrl_(BASE_URL, params) {
  let paramString = Object.keys(params)
                        .map(
                            key => encodeURIComponent(key) + '=' +
                                encodeURIComponent(params[key]))
                        .join('&');
  return BASE_URL + (BASE_URL.includes('?') ? '&' : '?') + paramString;
}

/**
 * Builds a URI from publisher ID and resource.
 * @param {string} publisherId The publisher ID of the AdMob account. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} resource The resource for the GET request. Acceptable values
 * are "adUnits", "apps", "mediationGroups", "accounts", "adUnitMappings",
 * "adSources", and "adapters".
 * @param {string} additionalParam An optional value that is used for certain
 * API calls. When the "resource" is "adUnitMappings", the additionalParam will
 * provide the ad unit ID value. When the "resource" is "adapters", the
 * additionalParam will provide the ad source ID value.
 * @param {string} resourceId An optional value that is used to identify the ID
 *     of the
 * resource in question.
 * @return {string} The complete URL.
 * @private
 */
function buildUri_(publisherId, resource, additionalParam, resourceId) {
  let uri = `${BASE_URL}${publisherId}`;
  if (RESOURCE_PATH_MAP.hasOwnProperty(resource)) {
    uri = `${uri}/${RESOURCE_PATH_MAP[resource]}`;
    if (!!additionalParam) {
      uri = `${uri}/${additionalParam}`;
    }
  }
  uri = `${uri}/${resource}`;
  if (!!resourceId) {
    uri = `${uri}/${resourceId}`;
  }
  return uri;
}

/**
 * Makes an API request.
 * @param {string} uri The API request URI.
 * @param {string} method The HTTP method ex: 'get', 'post', 'patch'.
 * @param {string} payload The request payload if required.
 * @return {!Object} The API response.
 * @private
 */
function makeAPIRequest_(uri, method, payload) {
  const headers = {
    'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
    'Content-Type': 'application/json'
  };

  const muteHttpExceptions = MUTE_HTTP_EXCEPTIONS[method];
  const options = {headers, method, muteHttpExceptions};
  if (!!payload) {
    options['payload'] = payload;
  }

  try {
    let response = UrlFetchApp.fetch(uri, options);
    return response;
  } catch (err) {
    console.log(`ERROR: ${uri} respaonse: ${err}`);
  }
}

/**
 * Logs API Response.
 * @param {string} method The HTTP method ex: 'get', 'post', 'patch'.
 * @param {string} resource The resource for the GET request. Acceptable values
 * are "adUnits", "apps", "mediationGroups", "accounts", "adUnitMappings",
 * "adSources", and "adapters".
 * @param {string} response The API response.
 * @private
 */
function logAPIResponse(method, resource, response) {
  console.log(`${method} ${resource} response: ${response}`);
}

/**
 * Makes a list request to the AdMob API.
 * @param {string} publisherId The publisher ID of the AdMob account. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} resource The resource for the GET request. Acceptable values
 * are "adUnits", "apps", "mediationGroups", "accounts", "adUnitMappings",
 * "adSources", and "adapters".
 * @param {string} additionalParam An optional value that is used for certain
 * API calls. When the "resource" is "adUnitMappings", the additionalParam will
 * provide the ad unit ID value. When the "resource" is "adapters", the
 * additionalParam will provide the ad source ID value.
 * @return {string} API response.
 */
function listAPIRequest(publisherId, resource, additionalParam) {
  console.log(`Begin list request for ${resource}`);
  const uri = buildUri_(publisherId, resource, additionalParam, '');
  const response = makeAPIRequest_(uri, 'get', '');
  logAPIResponse('List', resource, response);
  return response;
}

/**
 * Makes a POST request to the AdMob API.
 * @param {string} publisherId The publisher ID of the AdMob account. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} resource The resource for the POST request. Acceptable values
 * are "adUnits", "apps", "mediationGroups", and "adUnitMappings".
 * @param {string} payload JSON representation of the request payload.
 * @param {string} additionalParam An optional value that is used for certain
 * API calls. When the "resource" is "adUnitMappings", the additionalParam will
 * provide the ad unit ID value. When the "resource" is "adapters", the
 * additionalParam will provide the ad source ID value.
 * @return {string} API response.
 */
function createAPIRequest(publisherId, resource, payload, additionalParam) {
  console.log(`Begin create request for ${resource}`);
  const uri = buildUri_(publisherId, resource, additionalParam, '');
  const response = makeAPIRequest_(uri, 'post', payload);
  logAPIResponse('Create', resource, response);
  return response;
}

/**
 * Makes an updateMediationGroup request to the AdMob API.
 * @param {string} publisherId The publisher ID of the AdMob account.
 * @param {string} mediationGroupId The mediation group ID to update.
 * @param {string} payload JSON representation of the updateMediationGroup
 *     request payload.
 * @param {string} params Update mask parameters.
 * @return {string} API response.
 */
function updateMediationGroupAPIRequest(
    publisherId, mediationGroupId, payload, params) {
  console.log('Updating mediation groups ...');
  let resource = 'mediationGroups';
  let uri = buildUri_(publisherId, resource, '', mediationGroupId);
  uri = buildUrl_(uri, params);
  const response = makeAPIRequest_(uri, 'patch', payload);
  logAPIResponse('Update', resource, response);
  return response;
}
