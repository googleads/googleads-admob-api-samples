/** Constants for allowed fields. */
/** @private */
const allowedPlatforms = ['IOS', 'ANDROID'];
/** @private */
const allowedFormats = ['BANNER', 'INTERSTITIAL'];

/**
 * Creates a new mediation group or updates an existing mediation group with new
 * custom event mediation group lines. Configuration settings including CPM
 * values and encoded price points are specified by the Google spreadsheet
 * container the script is run within.
 * @param {string} publisherId AdMob publisher ID. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} platform App platform (e.g. "iOS or "ANDROID").
 * @param {string} format Ad unit format. Acceptable values are "BANNER" and
 * "INTERSTITIAL".
 * @param {!Array<string>} adUnitIdFragments An array of ad unit ID fragment(s).
 * See https://support.google.com/admob/answer/7356431 for additional
 * information.
 * @param {string} mediationGroupName Name of new mediation group to create.
 * @param {string} mediationGroupId ID of mediation group to update. See
 * https://support.google.com/admob/answer/12083090 for additional information.
 * @param {boolean} createMediationGroupFlag Flag for mediation group creation.
 *   If set to true, create a new mediation group, otherwise if set to false,
 *   update an existing mediation group.
 * @return {string} API response.
 */
function writeCustomEventMediationGroupLines(
    publisherId, platform, format, adUnitIdFragments, mediationGroupName,
    mediationGroupId, createMediationGroupFlag) {
  let count = 1;
  let mediationGroupLine;
  let countString;
  let mediationGroupLinesMap = new Map([]);
  let mediationUpdateMaskParam = '';
  let adUnitMappings = {};
  platform = platform.toString();
  format = format.toString();

  // Retrieve spreadsheet tab.
  const current_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configuration_spreadsheet =
      current_spreadsheet.getSheetByName(SHEET_NAME_CONFIGURATION);
  const [headers, ...data] =
      configuration_spreadsheet.getDataRange().getValues();

  // Validate field inputs for creating a new mediation group are accepted
  // values and end execution if not.
  if (createMediationGroupFlag) {
    if (!allowedPlatforms.includes(platform) ||
        !allowedFormats.includes(format)) {
      let error = `Platform:${platform} or Format:${format} not allowed.`;
      console.log(error);
      return error;
    }
  }

  // Validate mediation group ID platform and format type.
  if (!createMediationGroupFlag) {
    let response = listAPIRequest(publisherId, 'mediationGroups', '');
    let responseJson = JSON.parse(response);
    let mediationGroupToUpdate = responseJson.mediationGroups.find(
        mediationGroup => mediationGroup.mediationGroupId === mediationGroupId);
    if (mediationGroupToUpdate) {
      platform = mediationGroupToUpdate.targeting.platform;
      format = mediationGroupToUpdate.targeting.format;
    } else {
      let error = 'Mediation group to update does not exist';
      console.log(error);
      return error;
    }
  }

  // Iterates through each row of the spreadsheet data and creates a
  // a corresponding array with key value pairs of the column name to the value
  // (e.g. ["0.2", "abcde"] --> ["cpm":"0.2", "Encoded price point":"abcde"]).
  const mediationConfigurationsArray = data.map(row => {
    return row.reduce((accumulator, value, index) => {
      const key = headers[index];
      if (key === '') {
        return accumulator;
      }
      return {...accumulator, [key]: value};
    }, {});
  });

  // Return if there are more than 150 rows as no more than 150 ad sources can
  // be added at a time: https://support.google.com/admob/answer/7363694?hl=en.
  let rowsToProcess = mediationConfigurationsArray
                          .filter(row => (row[COLUMN_NAME_IGNORE] != 'YES'))
                          .length;
  if (rowsToProcess > MAX_ROWS_AD_SOURCE_INSTANCES) {
    console.log(
        `ERROR: No more than ${MAX_ROWS_AD_SOURCE_INSTANCES} ad source instances
        can be added to a mediation group: https://support.google.com/admob/answer/7363694`);
    return;
  }

  // Per row in the spreadsheet, create a new mediation group line.
  mediationConfigurationsArray.forEach((row) => {
    // Process rows that are not marked as IGNORED.
    if (!row[COLUMN_NAME_IGNORE]) {
      countString = count.toString();
      console.log(`Sheet row number ${countString}`);
      console.log(row);

      adUnitMappings = makeCreateAdUnitMappingRequest(
          row, publisherId, platform, adUnitIdFragments);
      console.log(
          'Printing all ad unit mappings for this row (mediation line).');
      console.log(adUnitMappings);

      let cpmMicros = parseInt(row[COLUMN_NAME_CPM] * MICROS_MULTIPLIER, 10);

      mediationGroupLine = {
        'displayName': `Amazon-${row[COLUMN_NAME_ENCODED_PRICE_POINT]}`,
        'adSourceId': CUSTOM_EVENT_AD_SOURCE_ID,
        'cpmMode': 'MANUAL',
        'cpmMicros': cpmMicros,
        'state': 'ENABLED',
        'adUnitMappings': adUnitMappings
      };

      let maskNegativeKey = count * -1;

      console.log('Printing mediation line:');
      // Set the mediationGroupLine key to a negative value to indicate that
      // this is a new line to be added to the existing mediation group.
      mediationGroupLinesMap.set(maskNegativeKey, mediationGroupLine);
      console.log(Object.fromEntries(mediationGroupLinesMap));
      mediationUpdateMaskParam += `mediationGroupLines["${maskNegativeKey}"],`;
      count++;
    }
  });

  // Update or create a new mediation group based on the
  // createMediationGroupFlag.
  if (createMediationGroupFlag) {
    return makeCreateMediationGroupRequest(
        publisherId, platform, format, adUnitIdFragments, mediationGroupName,
        mediationGroupLinesMap);
  } else {
    return makeUpdateMediationGroupRequest(
        publisherId, mediationGroupId, mediationGroupLinesMap,
        mediationUpdateMaskParam);
  }
}

/**
 * Makes a create mediation group request.
 * @param {string} publisherId AdMob publisher ID. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} platform App platform (e.g. "iOS or "ANDROID").
 * @param {string} format Ad unit format. Acceptable values are "BANNER" and
 * "INTERSTITIAL".
 * @param {!Array<string>} adUnitIdFragments Comma separated list of ad unit ID
 * fragment(s). See https://support.google.com/admob/answer/7356431 for
 * additional information.
 * @param {string} mediationGroupName Name of new mediation group to create.
 * @param {!Object} mediationGroupLinesMap JSON of mediation group lines.
 * @return {string} API response.
 */
function makeCreateMediationGroupRequest(
    publisherId, platform, format, adUnitIdFragments, mediationGroupName,
    mediationGroupLinesMap) {
  // Create new mediation group.
  let mediationGroupLinesObj = Object.fromEntries(mediationGroupLinesMap);
  // Add publisher prefix to ad unit fragment ID to create full ad unit ID(s).
  let adUnitIds = [];
  adUnitIdFragments.forEach(function(item) {
    adUnitIds.push(`ca-app-${publisherId}/${item}`);
  });
  let mediationGroup = {
    'displayName': mediationGroupName,
    'targeting': {
      'platform': `${platform}`,
      'format': `${format}`,
      'adUnitIds': adUnitIds
    },
    'mediationGroupLines': mediationGroupLinesObj
  };

  let mediationGroupJson = JSON.stringify(mediationGroup);
  console.log('Logging create mediation group payload');
  console.log(mediationGroupJson);
  let response =
      createAPIRequest(publisherId, 'mediationGroups', mediationGroupJson, '');
  return response;
}

/**
 * Makes an update mediation group request.
 * @param {string} publisherId AdMob publisher ID. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} mediationGroupId ID of new mediation group to update. See
 * https://support.google.com/admob/answer/12083090 for additional information.
 * @param {!Object} mediationGroupLinesMap JSON of mediation group lines.
 * @param {!Object} mediationUpdateMaskParam API update mask.
 * @return {string} API response.
 */
function makeUpdateMediationGroupRequest(
    publisherId, mediationGroupId, mediationGroupLinesMap,
    mediationUpdateMaskParam) {
  // Update an existing mediation group and keep the current mediation lines.
  let params = {'updateMask': mediationUpdateMaskParam};

  let mediationGroupLinesObj = Object.fromEntries(mediationGroupLinesMap);
  let mediationGroupPatchPayload = {
    'mediationGroupLines': mediationGroupLinesObj
  };

  let mediationGroupPatchPayloadJson =
      JSON.stringify(mediationGroupPatchPayload);
  console.log('Logging update mediation group payload');
  console.log(mediationGroupPatchPayloadJson);
  let response = updateMediationGroupAPIRequest(
      publisherId, mediationGroupId, mediationGroupPatchPayloadJson, params);
  return response;
}

/**
 * Makes a create ad unit mapping request.
 * @param {string} row Row from the spreadsheet with mediation line settings.
 * @param {string} publisherId AdMob publisher ID. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @param {string} platform App platform (e.g. "iOS or "ANDROID").
 * @param {!Array<string>} adUnitIdFragments Comma separated list of ad unit
 *     IDs.
 * @return {string} API response.
 */
function makeCreateAdUnitMappingRequest(
    row, publisherId, platform, adUnitIdFragments) {
  let adUnitMappings = {};
  // For each ad unit, create a new ad unit mapping.
  adUnitIdFragments.forEach(function(adUnitIdFragment) {
    let adUnitMapping;
    let adUnitConfigMap;
    console.log(`Creating ad unit mapping for ad unit ID fragment: ${
        adUnitIdFragment}`);
    let amazonRowName = `Amazon-${row[COLUMN_NAME_ENCODED_PRICE_POINT]}`;
    if (platform === 'ANDROID') {
      console.log('Creating ANDROID ad unit mapping.');
      adUnitConfigMap = new Map([
        [CUSTOM_EVENT_ANDROID_MAPPING_ID_LABEL, amazonRowName],
        [
          CUSTOM_EVENT_ANDROID_MAPPING_ID_CLASS_NAME,
          CUSTOM_EVENT_ANDROID_CLASSNAME
        ],
        [
          CUSTOM_EVENT_ANDROID_MAPPING_ID_PARAMETER,
          row[COLUMN_NAME_ENCODED_PRICE_POINT]
        ],
      ]);
      let adUnitConfigObj = Object.fromEntries(adUnitConfigMap);
      adUnitMapping = {
        'displayName': amazonRowName,
        'adapterId': CUSTOM_EVENT_ANDROID_ADAPTER_ID,
        'adUnitConfigurations': adUnitConfigObj
      };
    } else if (platform === 'IOS') {
      console.log('Creating iOS ad unit mapping.');
      adUnitConfigMap = new Map([
        [CUSTOM_EVENT_IOS_MAPPING_ID_LABEL, amazonRowName],
        [CUSTOM_EVENT_IOS_MAPPING_ID_CLASS_NAME, CUSTOM_EVENT_IOS_CLASSNAME],
        [
          CUSTOM_EVENT_IOS_MAPPING_ID_PARAMETER,
          row[COLUMN_NAME_ENCODED_PRICE_POINT]
        ],
      ]);
      adUnitConfigObj = Object.fromEntries(adUnitConfigMap);
      adUnitMapping = {
        'displayName': amazonRowName,
        'adapterId': CUSTOM_EVENT_IOS_ADAPTER_ID,
        'adUnitConfigurations': adUnitConfigObj
      };
    }
    let adUnitMappingJson = JSON.stringify(adUnitMapping);
    console.log(adUnitMappingJson);

    // Create ad unit mapping and save ID for mediation group line.
    let adUnitMappingResponseJson = createAPIRequest(
        publisherId, 'adUnitMappings', adUnitMappingJson, adUnitIdFragment);
    if (adUnitMappingResponseJson) {
      let adUnitMappingResponse = JSON.parse(adUnitMappingResponseJson);
      let adUnitId = `ca-app-${publisherId}/${adUnitIdFragment}`;
      adUnitMappings[adUnitId] = adUnitMappingResponse['name'];
    } else {
      return;
    }
  });

  return adUnitMappings;
}
