import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';
import * as moment from 'moment';


export class Intent implements ApiMapperInterface {
  intentName: string;
  selected?: boolean;

  constructor() { }

  mapFromApi(data: any): any {
    return {
      intentName: data,
      selected: false
    };
  }

  deserialize(input: any): Intent {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
