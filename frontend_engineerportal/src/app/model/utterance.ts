import { DropDownOption } from './dropdown-option.model';
import { ApiMapperInterface } from './api-mapper.interface';

export class Utterance implements ApiMapperInterface {
  uttername: string;
  intentOptions: DropDownOption[];
  selectedOption: string;
  approve: string;
  delete: string;
  sessionId: string;
  messageLogId: string;
  confidenceScore: string;

  constructor() {
  }

  mapFromApi(data: any): any {
    let utteranceObj =  new Utterance();
    utteranceObj.uttername= data.utterance ? data.utterance : '';
    utteranceObj.confidenceScore = data.confidenceScore ? data.confidenceScore : '';
    utteranceObj.selectedOption = data.intent ? data.intent : '';
    utteranceObj.approve = '';
    utteranceObj.delete = '';
    utteranceObj.messageLogId = data.messageLogId ? data.messageLogId : '';
    utteranceObj.sessionId = data.sessionId ? data.sessionId : '';
    return utteranceObj;
  }

  deserialize(input: any): Utterance {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
