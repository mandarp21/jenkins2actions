import { NLPProvider, STTProvider, TTSProvider } from '../app-constant';

export interface Luis {
  starter_key: string;
  app_id: string;
  api_subscription_key: string;
  version_id: string;
  region: string;
}

export interface Watson {
  password: string;
  username: string;
  workspace_id: string;
  watsonRegion: string;
}

export interface Lex {
  bot_name: string;
  alias: string;
}

export interface DialogFlow {
  client_email: string;
  private_key: string;
  projectId: string;
  language: string;
}

export interface STTWatson {
  username: string;
  password: string;
}

export interface STTBing {
  subscription_key: string;
  default_locale: string;
}

export interface STTGoogle {
  project_id: string;
  private_key: string;
  client_email: string;
  language: string;
}

export interface TTSWatson {
  username: string;
  password: string;
  voice: string;
}

export interface TTSBing {
  subscription_key: string;
  default_locale: string;
  voice: string;
}

export interface TTSAmazonPolly {
  aws_access_key_id: string;
  aws_secret_access_key: string;  
  voice: string;
}

export interface TTSGoogle {
  project_id: string;
  private_key: string;
  client_email: string;
  voice: string;
  language: string;
}

export class NLPAiConfig {
  provider: NLPProvider;
  config: Watson | Lex | Luis | DialogFlow;
  constructor(
    provider: any,
    config: any
  ) {
    this.provider = provider;
    this.config = config || {};
  }
}

export class STTAiConfig {
  provider: STTProvider;
  config: STTBing | STTGoogle | STTWatson;
  constructor(
    provider: any,
    config: any
  ) {
    this.provider = provider;
    this.config = config || {};
  }
}

export class TTSAiConfig {
  provider: TTSProvider;
  config: TTSBing | TTSWatson | TTSAmazonPolly | TTSGoogle;
  constructor(
    provider: any,
    config: any
  ) {
    this.provider = provider;
    this.config = config || {};
  }
}

export class Bot {
  botId: string;
  botName: string;
  botDescription: string;
  botStatus: boolean;
  botAuthentication: boolean;
  botLanguage: string;
  NLPProvider: NLPProvider;
  nlpConfig: Array<NLPAiConfig>;
  STTProvider: STTProvider;
  sttConfig: Array<STTAiConfig>;
  TTSProvider: TTSProvider;
  ttsConfig: Array<TTSAiConfig>;
  createdOn: number;
  createdBy: string;
  updatedBy: string;
  updatedOn: number;
  constructor() {
  }
}