import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

export class Bot implements ApiMapperInterface {
  botID: string;
  botImage: string;
  botName: string;
  botDescription: string;
  customerSatisfaction: string;
  escalated: string;
  intentsMatched: string;
  conversationComplete: string;
  totalVolume: string;
  totalReviews: string;
  lastModified: string;

  constructor() {
  }

  mapFromApi(data: any): any {
    return {
      botID: data['botID'],
      botName: data['botName'],
      botDescription: data['botDescription'],
      botImage: data['botImage'],
      lastModified: data['lastModified'],
      customerSatisfaction: data['customerSatisfaction'],
      escalated: data['escalated'],
      intentsMatched: data['intentsMatched'],
      conversationComplete: data['conversationComplete'],
      totalVolume: data['totalVolume'],
      totalReviews: data['totalReviews'],
    };
  }

  deserialize(input: any): Bot {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
