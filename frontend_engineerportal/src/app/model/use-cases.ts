import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';
import * as moment from 'moment';

export interface IUseCases {
  workerBotId?: string;
  useCaseId?: string;
  useCaseName: string;
  useCaseDescription?: string;
  masterBotDefaultAuthentication?: string;
  averageHumanHandlingTime?: string;
  collectFeedback?: boolean;
  entryNLC?: Array<string>;
  useCaseStatus?: string;
  createdBy?: string;
  updatedBy?: string;
  createdOn?: string;
  updatedOn?: string;
  useCaseChannel?: Array<string>;
}

export interface IGetUseCases {
  useCaseId: string;
  useCaseName: string;
  useCaseDescription: string;
  createdBy: string;
  updatedBy: string;
  averageHumanHandlingTime: string;
  collectFeedback: boolean;
  useCaseChannel?: Array<string>;
  entryIntents?: Array<string>;
  entryEntities?: Array<string>;
}

export class UseCases implements ApiMapperInterface {
  useCaseId: string;
  useCaseName: string;
  useCaseDescription: string;
  useCaseStatus: string;
  createdBy: string;
  updatedBy: string;
  createdOn: string;
  updatedOn: string;
  averageHumanHandlingTime: string;
  collectFeedback: boolean;
  useCaseChannel?: Array<string>;
  isEditable: boolean;
  conversationType: string;

  constructor() {}

  mapFromApi(data: any): any {
    return {
      useCaseId: data['useCaseId'],
      useCaseName: data['useCaseName'],
      useCaseDescription: data['useCaseDescription'],
      useCaseStatus: data['useCaseStatus'],
      averageHumanHandlingTime: data['averageHumanHandlingTime'],
      collectFeedback: data['collectFeedback'],
      createdBy: data['createdBy'],
      updatedBy: data['updatedBy'],
      // createdOn: moment.unix(data['createdOn'] / 1000).format('DD-MMM-YYYY HH:mm:ss'),
      // updatedOn: moment.unix(data['updatedOn'] / 1000).format('DD-MMM-YYYY HH:mm:ss'),
      createdOn: data['createdOn'],
      updatedOn: data['updatedOn'],
      useCaseChannel: data['useCaseChannel'],
      isEditable: data['isEditable'],
      conversationType: data['conversationType']
    };
  }

  mapToPostApi(data: any): any {
    const bot = {};
    bot['useCaseId'] = data['useCaseId'];
    bot['useCaseName'] = data['useCaseName'];
    bot['useCaseDescription'] = data['useCaseDescription'];
    bot['useCaseStatus'] = data['useCaseStatus'];
    bot['useCaseChannel'] = data['useCaseChannel'];
    bot['averageHumanHandlingTime'] = data['averageHumanHandlingTime'];
    bot['collectFeedback'] = data['collectFeedback'];
    bot['entryNLC'] = data['entryNLC'];
    bot['createdBy'] = data['createdBy'];
    bot['updatedBy'] = data['updatedBy'];
    bot['conversationType'] = data['conversationType'];
    return bot;
  }

  deserialize(input: any): UseCases {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
