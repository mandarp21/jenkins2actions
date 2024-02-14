export const ENVIROMENTS = {
  PROD: 'PROD',
  DEV: 'DEV',
  DEV2: 'DEV2',
  SIT: 'SIT',
  STAGE: 'STAGE',
  TEST: 'TEST',
  MOCK: 'MOCK',
  LOCAL: 'LOCAL'
};

export const API_ENV_BASE_URLS = {
  PROD: 'https://prod.srv12-va.com',
  DEV: 'https://dev.srv12-va.com',
  DEV2: 'https://dev2.srv12-va.com',
  TEST: 'https://test.srv12-va.com',
  SIT: 'https://sit.srv12-va.com',
  LOCAL: 'http://localhost',
  MOCK: '',
  STAGE: 'https://uat.srv12-va.com'
};

export const API_PORTS = {
  'backend-botmanagementservice': 14002,
  'backend-conversationdesignerservice': 14003,
  'backend-analyticsservice': 14000,
  'backend-admin-authentication-service': 4003,
  'backend-nlptrainer': 13010,
  'backend-channeladapter-engineerportal': 11009
};

export const API_URLS = {
  // Bot Manager
  CREATE_MASTER_BOT: 'backend-botmanagementservice/createMasterBot',
  UPDATE_MASTER_BOT: 'backend-botmanagementservice/updateMasterBot',
  GET_MASTER_BOT: 'backend-botmanagementservice/getMasterBot',
  DELETE_MASTER_BOT: 'backend-botmanagementservice/deleteMasterBot',
  CREATE_WORKER_BOT: 'backend-botmanagementservice/createWorkerBot',
  UPDATE_WORKER_BOT: 'backend-botmanagementservice/updateWorkerBot',
  GET_WORKER_BOT: 'backend-botmanagementservice/getWorkerBot',
  DELETE_WORKER_BOT: 'backend-botmanagementservice/deleteWorkerBot',
  LIST_BOTS: 'backend-botmanagementservice/listMasterBots',
  LIST_WORKER_BOTS: 'backend-botmanagementservice/listWorkerBots',
  GET_USE_CASE: 'backend-botmanagementservice/getUseCase',
  CREATE_USE_CASE: 'backend-botmanagementservice/createUseCase',
  LIST_USE_CASES: 'backend-botmanagementservice/listUseCases',
  UPDATE_USE_CASE: 'backend-botmanagementservice/updateUseCase',
  DELETE_USE_CASE: 'backend-botmanagementservice/deleteUseCase',
  LIST_VARIABLES: 'backend-botmanagementservice/listVariable',
  CREATE_VARIABLE: 'backend-botmanagementservice/createVariable',
  DELETE_VARIABLE: 'backend-botmanagementservice/deleteVariable',
  EXPORT_VARIABLES: 'backend-botmanagementservice/exportVariables',
  IMPORT_VARIABLES: 'backend-botmanagementservice/importVariables',
  UPDATE_VARIABLE: 'backend-botmanagementservice/updateVariable',
  GET_VARIABLE: 'backend-botmanagementservice/getVariable',

  // Conversation Manager
  CREATE_STEP: 'backend-conversationdesignerservice/addFlowStep',
  UPDATE_STEP: 'backend-conversationdesignerservice/editFlowStep',
  CREATE_CONVERSATION: 'backend-conversationdesignerservice/createConversationFlow',
  UPDATE_CONVERSATION: 'backend-conversationdesignerservice/updateConversationFlow',
  GET_CONVERSATION: 'backend-conversationdesignerservice/getConversationFlow',
  UPDATE_EXITPOINT: 'backend-conversationdesignerservice/updateExitPoint',
  LIST_CONVERSATION_FLOW: 'backend-conversationdesignerservice/listConversationFlows',
  EXPORT_USECASES: 'backend-conversationdesignerservice/exportUsecases',
  IMPORT_USECASES: 'backend-conversationdesignerservice/importUsecase',

  // Analytics Manager
  CONVERSATION_DETAILS: 'backend-analyticsservice/getConversationLog',
  CONVERSATION_LOG: 'backend-analyticsservice/listConversations',
  USECASE_ANALYTICS: 'backend-analyticsservice/getUseCaseAnalytics',
  INTENT_MATCHED_ANALYTICS: 'backend-analyticsservice/getIntentsMatchedAnalytics',
  RECLASSIFY_UTTERANCE: 'backend-analyticsservice/reclassifyUtterance',
  NLC_LOGS: 'backend-analyticsservice/getNLClog',

  // Admin Authentication
  ADMIN_LOGIN: 'backend-admin-authentication-service/authenticateAdmin',
  ADMIN_REGISTER: 'backend-admin-authentication-service/saveAdmin',
  ADMIN_LOGOUT: 'backend-admin-authentication-service/logoutAdmin',
  ADMIN_VALIDATE_AUTH: 'backend-admin-authentication-service/validateAuthentication',

  // NLP Trainer
  LIST_INTENTS: 'backend-nlptrainer/nlptrainer/listIntents',
  LIST_ENTITIES: 'backend-nlptrainer/nlptrainer/listEntities',
  ADD_UTTERANCE: 'backend-nlptrainer/nlptrainer/addUtterance',

  // Adapter websockets
  ENGINEERPORTAL_ADAPTER_CHAT: 'engineerPortalAdapterSocket',
  ENGINEERPORTAL_ADAPTER_SOCKET: 'backend-channeladaptor-engineerportal/socket.io'

};

export const MOCK_API_URLS = {
  CREATE_MASTER_BOT: '../backend-botmanagementservice/createMasterBot',
  GET_MASTER_BOT: '../backend-botmanagementservice/getMasterBot',
  UPDATE_MASTER_BOT: '../backend-botmanagementservice/updateMasterBot',
  DELETE_MASTER_BOT: '../backend-botmanagementservice/deleteMasterBot',
  CREATE_WORKER_BOT: '../backend-botmanagementservice/createWorkerBot',
  GET_WORKER_BOT: '../backend-botmanagementservice/getWorkerBot',
  DELETE_WORKER_BOT: '../backend-botmanagementservice/deleteWorkerBot',
  LIST_BOTS: '../backend-botmanagementservice/listMasterBots',
  UPDATE_WORKER_BOT: '../backend-botmanagementservice/updateWorkerBot',
  LIST_WORKER_BOTS: '../backend-botmanagementservice/listWorkerBots',

  GET_USE_CASE: '../backend-botmanagementservice/getUseCase',
  CREATE_USE_CASE: '../backend-botmanagementservice/createUseCase',
  LIST_USE_CASES: '../backend-botmanagementservice/listUseCases',
  UPDATE_USE_CASE: '../backend-botmanagementservice/updateUseCase',
  DELETE_USE_CASE: '../backend-botmanagementservice/deleteUseCase',

  LIST_VARIABLES: '../backend-botmanagementservice/listVariable',
  CREATE_VARIABLE: '../backend-botmanagementservice/createVariable',
  DELETE_VARIABLE: '../backend-botmanagementservice/deleteVariable',
  EXPORT_VARIABLES: '../backend-botmanagementservice/exportVariables',
  IMPORT_VARIABLES: '../backend-botmanagementservice/importVariables',
  UPDATE_VARIABLE: '../backend-botmanagementservice/updateVariable',
  GET_VARIABLE: '../backend-botmanagementservice/getVariable',

  CREATE_STEP: '../backend-conversationdesignerservice/addFlowStep',
  UPDATE_STEP: '../backend-conversationdesignerservice/editFlowStep',
  CREATE_CONVERSATION: '../backend-conversationdesignerservice/createConversationFlow',
  UPDATE_CONVERSATION: '../backend-conversationdesignerservice/updateConversationFlow',
  GET_CONVERSATION: '../backend-conversationdesignerservice/getConversationFlow',
  UPDATE_EXITPOINT: '../backend-conversationdesignerservice/updateExitPoint',
  LIST_CONVERSATION_FLOW: '../backend-conversationdesignerservice/listConversationFlows',
  EXPORT_USECASES: '../backend-conversationdesignerservice/exportUsecases',
  IMPORT_USECASES: '../backend-conversationdesignerservice/importUsecase',

  CONVERSATION_DETAILS: '../backend-analyticsservice/getConversationLog',
  CONVERSATION_LOG: '../backend-analyticsservice/listConversations',
  USECASE_ANALYTICS: '../backend-analyticsservice/getUseCaseAnalytics',
  INTENT_MATCHED_ANALYTICS: '../backend-analyticsservice/getIntentsMatchedAnalytics',
  RECLASSIFY_UTTERANCE: '../backend-analyticsservice/reclassifyUtterance',
  NLC_LOGS: '../backend-analyticsservice/getNLClog',

  ADMIN_LOGIN: '../backend-admin-authentication-service/authenticateAdmin',
  ADMIN_REGISTER: '../backend-admin-authentication-service/saveAdmin',
  ADMIN_LOGOUT: '../backend-admin-authentication-service/logoutAdmin',
  ADMIN_VALIDATE_AUTH: '../backend-admin-authentication-service/validateAuthentication',

  LIST_INTENTS: '../backend-nlptrainer/nlptrainer/listIntents',
  LIST_ENTITIES: '../backend-nlptrainer/nlptrainer/listEntities',
  ADD_UTTERANCE: '../backend-nlptrainer/nlptrainer/addUtterance',

  ENGINEERPORTAL_ADAPTER_CHAT: 'engineerPortalAdapterSocket'
};
