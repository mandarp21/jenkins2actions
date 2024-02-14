import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

import * as moment from 'moment';

export class ConversationLog implements Deserializable<ConversationLog>, ApiMapperInterface {
  sessionId: string;
  userId: string;
  useCaseName: string;
  useCaseStatus: string;
  startTimestamp: string;
  channel: string;
  useCaseLogId: string;

  constructor() { }

  mapFromApi(data: any): any {
    
    return {
      sessionId: data['sessionId'],
      userId: data['userId'] ? data['userId'] : "N/A",
      useCaseName: data['useCaseName'],
      useCaseStatus: data['useCaseStatus'],
      //startTimestamp: moment.unix((data['startTimestamp']) / 1000).format("DD-MMM-YYYY HH:mm:ss"),
      startTimestamp : data['startTimestamp'],
      channel: data['channel'],
      useCaseLogId: data['useCaseLogId']
    };
  }

  deserialize(input: any): ConversationLog {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
