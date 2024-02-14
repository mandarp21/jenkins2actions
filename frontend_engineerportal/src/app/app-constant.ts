export enum NLPProvider {
  dialogflow_v2 = 'dialogflow_v2',
  luis = 'luis',
  watson = 'watson',
  lex = 'lex',
  rasa = 'rasa',
  rhea = 'rhea',
  alexa = 'alexa'
}

export enum STTProvider {
  bingspeech = 'bingspeech',
  watson = 'watson',
  google = 'google'
}

export enum TTSProvider {
  bingspeech = 'bingspeech',
  watson = 'watson',
  polly = 'polly',
  google = 'google'
}

export enum watsonRegion {
  Dallas = 'Dallas',
  Washington = 'Washington, DC',
  Frankfurt = 'Frankfurt',
  Sydney = 'Sydney',
  Tokyo = 'Tokyo',
  London = 'London'
}

export enum branchingNodes {
  options = 'options',
  variable = 'variable',
  decision = 'decision',
  crsl = 'crsl',
  feedbackTiles = 'feedbackTiles',
  feedbackReqMsg = 'feedbackReqMsg',
  dynamicButtons = 'dynamicButtons'
}

export const luisRegion = [
  { value: 'eastAsia', key: 'East Asia' },
  { value: 'southeastAsia', key: 'Southeast Asia' },
  { value: 'australiaEast', key: 'Australia East' },
  { value: 'northEurope', key: 'North Europe' },
  { value: 'westEurope', key: 'West Europe' },
  { value: 'eastUs', key: 'East US' },
  { value: 'eastUs2', key: 'East US 2' },
  { value: 'southCentralUs', key: 'South Central US' },
  { value: 'westCentralUs', key: 'West Central US' },
  { value: 'westUs', key: 'West US' },
  { value: 'westus2', key: 'West US 2' },
  { value: 'brazilSouth', key: 'Brazil South' }
];

export const Region = [
  { value: 'Dallas', key: 'Dallas' },
  { value: 'Washington, DC', key: 'Washington, DC' },
  { value: 'Frankfurt', key: 'Frankfurt' },
  { value: 'Sydney', key: 'Sydney' },
  { value: 'Tokyo', key: 'Tokyo' },
  { value: 'London', key: 'London' }
];
export const NLP = [
  { value: 'dialogflow_v2', key: 'Google DialogFlow' },
  { value: 'luis', key: 'Microsoft LUIS' },
  { value: 'watson', key: 'IBM Watson Assistant' },
  { value: 'lex', key: 'Amazon Lex' },
  { value: 'rasa', key: 'RASA' },
  { value: 'rhea', key: 'RHEA' },
  { value: 'alexa', key: 'Amazon Alexa' }
];

export const STT = [
  { value: 'bingspeech', key: 'Microsoft Bing' },
  { value: 'watson', key: 'Watson Speech-To-Text' },
  { value: 'google', key: 'Google Speech-To-Text' },
  { value: 'none', key: 'None' }
];

export const TTS = [
  { value: 'bingspeech', key: 'Microsoft Bing' },
  { value: 'watson', key: 'Watson Text-To-Speech' },
  { value: 'google', key: 'Google Text-To-Speech' },
  { value: 'polly', key: 'Amazon Polly' },
  { value: 'none', key: 'None' }
];

export const CHANNEL_PAYLOAD_OPTIONS = {
  web: [ 'msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons', 'feedbackTiles', 'feedbackReqMsg'],
  voice: ['msg', 'variable', 'decision'],
  twilioText: ['variable', 'msg'],
  skype: ['msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons'],
  facebook: ['msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons'],
  email: ['msg', 'variable', 'decision'],
  msteams: ['msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons'],
  slack: ['msg', 'variable', 'decision'],
  whatsapp: ['msg', 'variable', 'decision'],
  alexa: ['msg', 'variable', 'decision'],
  zendesk: [ 'msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons', 'feedbackTiles', 'feedbackReqMsg','conditionEval'],
  pinpoint: [ 'msg', 'options', 'variable', 'decision', 'crsl', 'datepicker', 'dynamicButtons', 'feedbackTiles', 'feedbackReqMsg','conditionEval']
};


export const APP_MESSAGE = {
  BOT_SAVE_SUCCESS: 'Bot Info saved successfully',
  BOT_SAVE_ERROR: 'Unable to save Bot',
  USECASE_SAVE_SUCCESS: 'Usecase saved successfully',
  USECASE_SAVE_ERROR: 'Unable to save Usecase',
  DELETE_USECASE_SUCCESS: 'Use case deleted successfully',
  DELETE_USECASE_FAILED: 'Unable to delete Usecase.',
  DELETE_WORKERBOT_SUCCESS: 'Worker Bot deleted successfully',
  DELETE_WORKERBOT_FAILED: 'Unable to delete Worker Bot.',
  DELETE_MASTERBOT_SUCCESS: 'Master Bot deleted successfully',
  DELETE_MASTERBOT_FAILED: 'Unable to delete Master Bot.',
  DELETE_VARIABLE_SUCCESS: 'Variable deleted successfully.',
  DELETE_VARIABLE_FAILED: 'Unable to delete Variable.',
  BOT_ICON_LIMIT_ERROR: 'The Bot icon should not be more than 100x100',
  END_FLOW_NOT_CHECKED: 'End Flow is not checked for some nodes.',
  UPLOAD_FILE_FORMAT: 'Please upload in JSON format.'
};

export const USECASES = {
  NON_DELETABLE_USECASES: ['greetings', 'feedback', 'incomprehension', 'escalation']
};

export const TOOLTIPS = {
  MASTER_NLP_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  MASTER_STT_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  MASTER_TTS_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  WORKER_NLP_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  WORKER_TTS_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  WORKER_STT_AI:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  MASTER_AI_SERVICES:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  MASTER_BOT_INFO:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  MASTER_BOT_AUTHENTICATION:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  MASTER_BOT_STATUS:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ASSOCIATED_INTENTS:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ADD_UTTERANCE:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};
