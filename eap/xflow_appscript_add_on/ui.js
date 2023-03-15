/**
 * @fileoverview Describes the AdMob API add-on UI.
 */

/**
 * Callback for rendering the main card.
 * @param {!Object} e The event object.
 * @return {!CardService.Card} The card to show the user.
 */
function onHomepage(e) {
  return createHomePage(e, '', '', '', '');
}

var inputs = {
  'publisherId': '',
  'adUnitIdFragmentsList': '',
  'adUnitIdFragments': [],
  'mediationGroupId': '',
  'mediationGroupName': '',
  'format': '',
  'platform': '',
  'mediationConfigOptionBool': ''
};

var addOnLogs = [];

const adUnitFragmentInfo = {
  'text':
      'The ad unit ID fragment is the last 10 digits, "YYYYYYYYYY" of your ad unit ID which follows the format "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY".'
};

/** @private */
const configurationInput = {
  'title':
      'Mediation group update options. Only a single selection is allowed.',
  'fieldName': 'mediationConfigOption',
  'inputs': [
    {
      'itemTitle': 'Create new mediation group',
      'itemName': 'createMediationGroup',
      'itemValue': true
    },
    {
      'itemTitle': 'Add mediation lines to existing mediation group.',
      'itemName': 'updateMediationGroup',
      'itemValue': false
    }
  ]
};

/** @private */
const selectionInputs = [
  {
    'title': 'Platform',
    'fieldName': 'platform',
    'inputs': [
      {'itemTitle': 'ANDROID', 'itemName': 'ANDROID', 'itemValue': true},
      {'itemTitle': 'iOS', 'itemName': 'IOS', 'itemValue': false}
    ]
  },
  {
    'title': 'Format',
    'fieldName': 'format',
    'inputs': [
      {'itemTitle': 'BANNER', 'itemName': 'BANNER', 'itemValue': true}, {
        'itemTitle': 'INTERSTITIAL',
        'itemName': 'INTERSTITIAL',
        'itemValue': false
      }
    ]
  }
];

const pubIdTextInput = {
  'title': 'Provide your publisher ID (pub-XXXXXXXXXXXXXXXX).',
  'fieldName': 'publisherId',
  'value': 'pub-XXXXXXXXXXXXXXXX'
};

const adUnitIDFragmentTextInput = {
  'title':
      'Add your ad unit ID fragment(s) in a comma separated list with no spaces.',
  'fieldName': 'adUnitIdFragments',
  'value': 'YYYYYYYYYY'
};

const mediationGroupIdTextInput = {
  'title': 'Mediation group ID to update.',
  'fieldName': 'mediationGroupId',
  'value': 'ZZZZZZZZZZZ'
};

const mediationGroupNameTextInput = {
  'title': 'Mediation group name.',
  'fieldName': 'mediationGroupName',
  'value': 'Enter mediation group name'
};

/**
 * Helper function to create a text input card.
 * @param {!Object} textInput The input for the text input including
 * the title, field name and inputs.
 * @return {!Object} cardTextInput The text input card being returned.
 */
function createTextInput(textInput) {
  let cardTextInput = CardService.newTextInput()
                          .setTitle(textInput.title)
                          .setFieldName(textInput.fieldName)
                          .setValue(textInput.value)
                          .setMultiline(true);
  return cardTextInput;
}

/**
 * Helper function to create a text card section.
 * @param {!Object} text The text to be displayed.
 * @return {!Object} cardText The text card being returned.
 */
function createTextCard(text) {
  let textCard = CardService.newDecoratedText().setText(text).setWrapText(true);
  return textCard;
}

/**
 * Helper function to create a selection input card.
 * @param {!Object} selectionInput The input for the selection input including
 * the title, field name and inputs.
 * @return {!Object} cardSelectionInput The selection input card being returned.
 */
function createSelectionInput(selectionInput) {
  let cardSelectionInput =
      CardService.newSelectionInput()
          .setType(CardService.SelectionInputType.RADIO_BUTTON)
          .setTitle(selectionInput.title)
          .setFieldName(selectionInput.fieldName);

  for (let input of selectionInput.inputs) {
    cardSelectionInput.addItem(
        input.itemTitle, input.itemName, input.itemValue);
  }
  return cardSelectionInput;
}

/**
 * Generate card for specific input configuration data.
 * @param {!Object} e The event object.
 * @return {!CardService.Card} The card to show to the user.
 */
function configureMediationCard(e) {
  let mediationConfigOption = e.commonEventObject.formInputs
                                  .mediationConfigOption.stringInputs.value[0];

  let cardSection = CardService.newCardSection();

  if (mediationConfigOption === 'createMediationGroup') {
    cardSection.addWidget(createTextInput(mediationGroupNameTextInput));
    for (let selectionInput of selectionInputs) {
      cardSection.addWidget(createSelectionInput(selectionInput));
    }
  }

  if (mediationConfigOption === 'updateMediationGroup') {
    cardSection.addWidget(createTextInput(mediationGroupIdTextInput));
  }

  // Button section
  let buttonSection = CardService.newCardSection().addWidget(
      CardService.newButtonSet().addButton(
          CardService.newTextButton()
              .setText('Configure mediation group')
              .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
              .setOnClickAction(
                  CardService.newAction()
                      .setFunctionName('configureMediationButtonAction')
                      .setParameters(
                          {'mediationConfigOption': mediationConfigOption})
                      .setParameters({
                        'publisherId': e.commonEventObject.formInputs
                                           .publisherId.stringInputs.value[0]
                      })
                      .setParameters({
                        'adUnitIdFragments':
                            e.commonEventObject.formInputs.adUnitIdFragments
                                .stringInputs.value[0]
                      }))
              .setDisabled(false)));

  var card = CardService.newCardBuilder()
                 .addSection(cardSection)
                 .addSection(buttonSection);

  return card.build();
}

/**
 * Main function to generate the main card.
 * @param {!Object} e The event object.
 * @param {string} mediationGroupId Mediation group Id. See
 * https://support.google.com/admob/answer/12083090 for additional information.
 * @param {string} adUnitIdFragments Comma separated list of ad unit ID
 * fragment(s). See https://support.google.com/admob/answer/7356431 for
 * additional information.
 * @param {string} publisherId AdMob publisher ID.
 * @param {string} mediationGroupName Mediation group name. See
 * https://support.google.com/admob/answer/2784578 for additional information.
 * @return {!CardService.Card} The card to show to the user.
 */
function createHomePage(e) {
  let hostApp = e['hostApp'];
  let cardSection = CardService.newCardSection();
  cardSection.addWidget(createSelectionInput(configurationInput));
  cardSection.addWidget(createTextInput(pubIdTextInput));

  cardSection.addWidget(CardService.newDecoratedText()
                            .setText(adUnitFragmentInfo['text'])
                            .setWrapText(true));

  cardSection.addWidget(createTextInput(adUnitIDFragmentTextInput));

  // Button section
  let buttonSection = CardService.newCardSection().addWidget(
      CardService.newButtonSet().addButton(
          CardService.newTextButton()
              .setText('Configure mediation group.')
              .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
              .setOnClickAction(CardService.newAction().setFunctionName(
                  'configureMediationCard'))
              .setDisabled(false)));

  var card = CardService.newCardBuilder()
                 .addSection(cardSection)
                 .addSection(buttonSection);

  return card.build();
}

/**
 * Function to validate and set necessary inputs.
 *
 * @param {!Object} e The event object.
 * @param {!Object} mediationConfigOption The mediation configuration flag.
 * Valid inputs are either createMediationGroup or updateMediationGroup.
 * @return {boolean} Return true if publisher inputs are valid and false
 * otherwise.
 */
function isValidPublisherInput(e, parameters) {
  try {
    let mediationConfigOption = parameters['mediationConfigOption'];
    inputs.adUnitIdFragmentsList = parameters['adUnitIdFragments'];
    inputs.adUnitIdFragments = parseListIntoArray(inputs.adUnitIdFragmentsList);
    inputs.publisherId = parameters['publisherId'];
    if (mediationConfigOption === 'createMediationGroup') {
      inputs.mediationConfigOptionBool = true;
      inputs.mediationGroupName = e.commonEventObject.formInputs
                                      .mediationGroupName.stringInputs.value[0];
      inputs.format = e.commonEventObject.formInputs.format.stringInputs.value;
      inputs.platform =
          e.commonEventObject.formInputs.platform.stringInputs.value;
      inputs.mediationGroupId = '0';
    } else if (mediationConfigOption === 'updateMediationGroup') {
      inputs.mediationConfigOptionBool = false;
      inputs.mediationGroupId =
          e.commonEventObject.formInputs.mediationGroupId.stringInputs.value[0];
      inputs.mediationGroupName = '';
    } else {
      addOnLogs.push(
          'INVALID CONFIGURATION OPTION: Select mediation group create or update.');
      return false;
    }
  } catch (e) {
    addOnLogs.push('INVALID PUBLISHER INPUT.');
    return false;
  }
  return true;
}

/**
 * Parses comma separated list of items into an array.
 * @param {string} list Comma separated list of items.
 * @return {!Array<string>} Array of items.
 */
function parseListIntoArray(list) {
  let array = [];
  array = list.split(/\s*,\s*/);
  return array;
}

/**
 * Callback function for a button action. Validated necessary inputs and
 * instructs AdMob API to configure mediation based on inputs.
 *
 * @param {!Object} e The event object.
 * @return {!CardService.Card} The card to show to the user.
 */
function configureMediationButtonAction(e) {
  let response;
  let parameters = e.parameters;
  let cardSection = CardService.newCardSection();

  if (isValidPublisherInput(e, parameters)) {
    console.log('Add On Parameters:');
    console.log(parameters);
    response = writeCustomEventMediationGroupLines(
        inputs.publisherId, inputs.platform, inputs.format,
        inputs.adUnitIdFragments, inputs.mediationGroupName,
        inputs.mediationGroupId, inputs.mediationConfigOptionBool);
    let jsonResponse = JSON.parse(response);
    if (jsonResponse.hasOwnProperty('error')) {
      addOnLogs.push('ERROR: ' + jsonResponse.error.message);
    } else {
      addOnLogs.push(
          'SUCCESSFUL: mediation group ID is ' + jsonResponse.mediationGroupId);
    }
  }

  for (let addOnLog of addOnLogs) {
    console.log(addOnLog);
    cardSection.addWidget(createTextCard(addOnLog));
  }

  var card = CardService.newCardBuilder().addSection(cardSection);

  return card.build();
}