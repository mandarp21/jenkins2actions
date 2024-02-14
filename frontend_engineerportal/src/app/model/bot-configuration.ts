import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

export class BotConfiguration implements Deserializable<BotConfiguration>, ApiMapperInterface {
  botURL: string;
  botName: string;
  botDesc: string;
  botType: string;
  botNlp: string;
  speechToText: string;
  textToSpeech: string;


  constructor() { }

  mapFromApi(data: any): any {
    return {
      botURL: data['botURL'],
      botName: data['botName'],
      botDesc: data['botDescription'],
      botType: data['botType'],
      botNlp: data['nlp'],
      speechToText: data['stt'],
      textToSpeech: data['tts'],
    };
  }

  deserialize(input: any): BotConfiguration {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
