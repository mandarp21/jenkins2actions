import { Deserializable } from '../../model/deserializable.interface';
export class Variable {
  id: string;
  masterBotId: string;
  name: string;
  type: string;
  description: string;
  config: any;

  mapToPostApi(payload: any): any {
    const objToSend = {
      id: payload['id'] ? payload['id'] : '',
      masterBotId: payload['masterBotId'],
      name: payload['name'],
      type: payload['type'],
      description: payload['description'],
      config: payload['config']
    };

    if (payload['apiId']) {
      objToSend['id'] = payload['apiId'];
    }

    return objToSend;
  }

  mapFromApi(data: any): any {
    const objToSend = {
      id: data['id'] ? data['id'] : '',
      masterBotId: data['masterBotId'] ? data['masterBotId'] : '',
      name: data['name'] ? data['name'] : '',
      type: data['type'] ? data['type'] : '',
      description: data['description'] ? data['description'] : '',
      config: data['config'] ? JSON.stringify(data['config']) : ''
    };
    return objToSend;
  }

  deserialize(input: any): Variable {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
