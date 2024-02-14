import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

import * as moment from 'moment';

export class ConversationDetails implements ApiMapperInterface {
  timestamp: string;
  userMessage: string;
  response: Array<string>;

  constructor() { }

  mapFromApi(data: any): any {
    return {
      //timestamp: moment.unix((data['timestamp']) / 1000).format("DD-MMM-YYYY HH:mm:ss"),
      timestamp: data['timestamp'],
      userMessage: data['userMessage'],
      response: data['response']
    };
  }

  deserialize(input: any): ConversationDetails {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
