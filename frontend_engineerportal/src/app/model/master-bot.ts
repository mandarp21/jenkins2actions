import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';
import { Bot, NLPAiConfig, TTSAiConfig, STTAiConfig } from './bot.model';
import { CustomerSatisfaction, AutomationData, EscalationData, IntentMatched } from './analytics';
import * as moment from 'moment';

export class MasterBot extends Bot implements Deserializable<MasterBot>, ApiMapperInterface {
  botImage: string;
  botAuthentication: boolean;
  botLanguage: string;
  botDefaultBotId: string;
  customerSatisfaction: string;
  escalation: string;
  intentsMatched: string;
  automation: string;
  barChartData: any;
  botTelephoneNumber: string;

  constructor() {
    super();
    this.automation = '0';
    this.escalation = '0';
    this.customerSatisfaction = '0';
    this.intentsMatched = '0';
  }

  mapFromApi(data: any): any {
    const bot = {};
    bot['botId'] = data['masterBotId'];
    bot['botName'] = data['masterBotName'];
    bot['botDescription'] = data['masterBotDescription'];
    bot['botImage'] = data['masterBotImage'];
    bot['createdOn'] = moment.unix((data['createdOn']) / 1000).format("DD-MMM-YYYY HH:mm:ss");
    bot['createdBy'] = data['createdBy'];
    bot['updatedBy'] = data['updatedBy'];
    bot['botTelephoneNumber'] = data['masterBotTelephoneNumber'];
    //bot['lastModified'] = moment.unix((data['updatedOn']) / 1000).format("DD-MMM-YYYY HH:mm:ss");
    bot['lastModified'] = data['updatedOn'];

    if (data['masterBotStatus']) {
      bot['botStatus'] = (data['masterBotStatus'].toLowerCase() === 'active') ? true : false;
    }

    if (data['masterBotDefaultBotId']) {
      bot['botDefaultBotId'] = data['masterBotDefaultBotId'];
    }

    if (data['masterBotDefaultAuthentication']) {
      bot['botAuthentication'] = data['masterBotDefaultAuthentication'];
    }

    if (data['masterBotDefaultLanguage']) {
      bot['botLanguage'] = data['masterBotDefaultLanguage'];
    }

    if (data.hasOwnProperty('currentNLPProvider')) {
      let nlpConfigArr = [];
      if (data['nlpConfig']) {
        nlpConfigArr = data['nlpConfig'];
      }
      bot['NLPProvider'] = data['currentNLPProvider'];
      if (nlpConfigArr.length) {
        bot['nlpConfig'] = [];
        nlpConfigArr.forEach((nlpConfig) => {
          bot['nlpConfig'].push(new NLPAiConfig(nlpConfig['provider'], nlpConfig['config']));
        });
      }
    }

    if (data.hasOwnProperty('currentSTTProvider')) {
      let sttConfigArr = [];
      if (data['sttConfig']) {
        sttConfigArr = data['sttConfig'];
      }
      bot['STTProvider'] = data['currentSTTProvider'];
      if (sttConfigArr.length) {
        bot['sttConfig'] = [];
        sttConfigArr.forEach((sttConfig) => {
          bot['sttConfig'].push(new STTAiConfig(sttConfig['provider'], sttConfig['config']));
        });
      }
    }

    if (data.hasOwnProperty('currentTTSProvider')) {
      let ttsConfigArr = [];
      if (data['ttsConfig']) {
        ttsConfigArr = data['ttsConfig'];
      }
      bot['TTSProvider'] = data['currentTTSProvider'];
      if (ttsConfigArr.length) {
        bot['ttsConfig'] = [];
        ttsConfigArr.forEach((ttsConfig) => {
          bot['ttsConfig'].push(new TTSAiConfig(ttsConfig['provider'], ttsConfig['config']));
        });
      }
    }
    return bot;
  }

  mapToPostApi(data: any): any {
    const bot = {};
    bot['masterBotName'] = data['botName'];
    bot['masterBotDescription'] = data['botDescription'];
    bot['masterBotImage'] = data['botImage'];
    bot['masterBotDefaultAuthentication'] = data['botAuthentication'];
    bot['masterBotDefaultLanguage'] = data['botLanguage'];
    bot['masterBotTelephoneNumber'] = data['botTelephoneNumber'];
    bot['createdBy'] = data['createdBy'];
    bot['updatedBy'] = data['createdBy'];
    bot['NLPProvider'] = data['NLPProvider'];
    bot['NLPConfig'] = new NLPAiConfig(data['NLPProvider'], data['nlpConfig']);
    if (data['STTProvider']) {
      bot['STTProvider'] = data['STTProvider'];
      bot['STTConfig'] = new STTAiConfig(data['STTProvider'], data['sttConfig']);
    }
    if (data['TTSProvider']) {
      bot['TTSProvider'] = data['TTSProvider'];
      bot['TTSConfig'] = new TTSAiConfig(data['TTSProvider'], data['ttsConfig']);
    }

    return bot;
  }

  mapToUpdateApi(data: any): any {
    const bot = {};
    bot['masterBotId'] = data['botId'];
    bot['masterBotImage'] = data['botImage'];
    bot['masterBotName'] = data['botName'];
    bot['masterBotDefaultLanguage'] = data['botLanguage'];
    bot['masterBotDescription'] = data['botDescription'];
    bot['masterBotTelephoneNumber'] = data['botTelephoneNumber'];
    bot['masterBotDefaultAuthentication'] = data['botAuthentication'];
    bot['masterBotStatus'] = (data['botStatus'] === true) ? 'active' : 'inactive';
    bot['updatedBy'] = data['updatedBy'];
    bot['adminUserId'] = data['adminUserId'];
    return bot;
  }

  deserialize(input: any, fromAPI: boolean = true): MasterBot {
    const data = (fromAPI) ? this.mapFromApi(input) : input;
    Object.assign(this, data);
    return this;
  }

}
