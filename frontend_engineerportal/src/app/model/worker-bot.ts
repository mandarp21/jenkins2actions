import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';
import { Bot, NLPAiConfig, STTAiConfig, TTSAiConfig } from './bot.model';
import { CustomerSatisfaction, AutomationData, EscalationData, IntentMatched } from './analytics';
import * as moment from 'moment';

export class WorkerBot extends Bot implements Deserializable<WorkerBot>, ApiMapperInterface {

  masterBotId: string;
  associatedIntents: Array<string>;
  associatedEntities: Array<string>;
  customerSatisfaction: string;
  escalation: string;
  intentsMatched: string;
  automation: string;
  barChartData: any;

  constructor() {
    super();
    this.intentsMatched = '0';
    this.automation = '0';
    this.escalation = '0';
    this.customerSatisfaction = '0';
  }

  mapFromApi(data: any): any {
    const bot = {};
    bot['botId'] = data['workerBotId'];
    bot['botName'] = data['workerBotName'];
    bot['botDescription'] = data['workerBotDescription'];
    bot['createdOn'] = moment.unix((data['createdOn']) / 1000).format("DD-MMM-YYYY HH:mm:ss");
    bot['createdBy'] = data['createdBy'];
    bot['updatedBy'] = data['updatedBy'];
    //bot['lastModified'] = moment.unix((data['updatedOn']) / 1000).format("DD-MMM-YYYY HH:mm:ss");
    bot['lastModified'] = data['updatedOn'];

    if (data['masterBotId']) {
      bot['masterBotId'] = data['masterBotId'];
    }

    if (data['workerBotStatus']) {
      bot['botStatus'] = (data['workerBotStatus'].toLowerCase() === 'active') ? true : false;
    }

    if (data['workerBotLanguage']) {
      bot['botLanguage'] = data['workerBotLanguage'];
    }

    if (data['workerBotAuthentication']) {
      bot['botAuthentication'] = data['workerBotAuthentication'];
    }

    if (data.hasOwnProperty('workerBotCurrentNLPProvider')) {
      let nlpConfigArr = [];
      if (data['workerBotNLPConfig']) {
        nlpConfigArr = data['workerBotNLPConfig'];
      }
      bot['NLPProvider'] = data['workerBotCurrentNLPProvider'];
      if (nlpConfigArr.length) {
        bot['nlpConfig'] = [];
        nlpConfigArr.forEach((nlpConfig) => {
          bot['nlpConfig'].push(new NLPAiConfig(nlpConfig['provider'], nlpConfig['config']));
        });
      }
    }

    if (data.hasOwnProperty('workerBotCurrentSTTProvider')) {
      let sttConfigArr = [];
      if (data['workerBotSTTConfig']) {
        sttConfigArr = data['workerBotSTTConfig'];
      }
      bot['STTProvider'] = data['workerBotCurrentSTTProvider'];
      if (sttConfigArr.length) {
        bot['sttConfig'] = [];
        sttConfigArr.forEach((sttConfig) => {
          bot['sttConfig'].push(new STTAiConfig(sttConfig['provider'], sttConfig['config']));
        });
      }
    }

    if (data.hasOwnProperty('workerBotCurrentTTSProvider')) {
      let ttsConfigArr = [];
      if (data['workerBotTTSConfig']) {
        ttsConfigArr = data['workerBotTTSConfig'];
      }
      bot['TTSProvider'] = data['workerBotCurrentTTSProvider'];
      if (ttsConfigArr.length) {
        bot['ttsConfig'] = [];
        ttsConfigArr.forEach((ttsConfig) => {
          bot['ttsConfig'].push(new TTSAiConfig(ttsConfig['provider'], ttsConfig['config']));
        });
      }
    }

    if (data['associatedIntents']) {
      bot['associatedIntents'] = data['associatedIntents'];
    }

    if (data['associatedEntities']) {
      bot['associatedEntities'] = data['associatedEntities'];
    }
    return bot;
  }

  mapToPostApi(data: any): any {
    const bot = {};
    if (data['botId']) {
      bot['workerBotId'] = data['botId'];
    }
    bot['masterBotId'] = data['masterBotId'];
    bot['workerBotName'] = data['botName'];
    bot['workerBotLanguage'] = data['botLanguage'];
    bot['workerBotDescription'] = data['botDescription'];
    bot['workerBotAuthentication'] = data['botAuthentication'];
    bot['createdBy'] = data['createdBy'];
    bot['updatedBy'] = data['updatedBy'];
    bot['workerBotCurrentNLPProvider'] = data['NLPProvider'];
    bot['workerBotNLPConfig'] = new NLPAiConfig(data['NLPProvider'], data['nlpConfig']);
    if (data['STTProvider']) {
      bot['workerBotCurrentSTTProvider'] = data['STTProvider'];
      bot['workerBotSTTConfig'] = new STTAiConfig(data['STTProvider'], data['sttConfig']);
    }

    if (data['TTSProvider']) {
      bot['workerBotCurrentTTSProvider'] = data['TTSProvider'];
      bot['workerBotTTSConfig'] = new TTSAiConfig(data['TTSProvider'], data['ttsConfig']);
    }

    bot['associatedIntents'] = (data['associatedIntents']) ? data['associatedIntents'] : [];
    bot['associatedEntities'] = (data['associatedEntities']) ? data['associatedEntities'] : [];
    return bot;
  }

  mapToPutApi(data: any): any {
    const bot = {};
    bot['workerBotId'] = data['botId'];
    bot['workerBotName'] = data['botName'];
    bot['workerBotLanguage'] = data['botLanguage'];
    bot['workerBotDescription'] = data['botDescription'];
    bot['workerBotAuthentication'] = data['botAuthentication'];
    bot['workerBotStatus'] = (data['botStatus'] === true) ? 'active' : 'inactive';
    bot['updatedBy'] = data['updatedBy'];
    bot['workerBotCurrentNLPProvider'] = data['NLPProvider'];
    bot['workerBotNLPConfig'] = new NLPAiConfig(data['NLPProvider'], data['nlpConfig']);
    if (data['STTProvider']) {
      bot['workerBotCurrentSTTProvider'] = data['STTProvider'];
      bot['workerBotSTTConfig'] = new STTAiConfig(data['STTProvider'], data['sttConfig']);
    }
    if (data['TTSProvider']) {
      bot['workerBotCurrentTTSProvider'] = data['TTSProvider'];
      bot['workerBotTTSConfig'] = new TTSAiConfig(data['TTSProvider'], data['ttsConfig']);
    }

    bot['associatedIntents'] = data['associatedIntents'];
    bot['associatedEntities'] = data['associatedEntities'];
    return bot;
  }
  deserialize(input: any, fromAPI: boolean = true): WorkerBot {
    const data = (fromAPI) ? this.mapFromApi(input) : input;
    Object.assign(this, data);
    return this;
  }

}
