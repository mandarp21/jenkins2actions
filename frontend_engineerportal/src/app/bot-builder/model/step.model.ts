import { Deserializable } from '../../model/deserializable.interface';
export class Step implements Deserializable<Step> {
  currentStep: string;
  owner: string;
  stepType: string;
  userExample: string;
  intent: string;
  nlc: Array<any>;
  entities: Array<any>;
  nextSteps: Array<string>;
  title: string;
  responseType?: string;
  response?: Array<any>;
  responseConfig?: object;
  endFlow?: boolean;

  mapFromApi(data: any): any {
    const step = {};

    step['currentStep'] = data['currentStep'];
    step['nextSteps'] = data['nextSteps'];
    step['owner'] = data['owner'];
    step['stepType'] = data['stepType'];
    step['description'] = data['description'];
    step['intent'] = data['intent'];
    step['entities'] = data['entities'];
    step['nlc'] = data['nlc'];
    step['responseType'] = data['responseType'];
    step['response'] = data['response'];
    step['responseConfig'] = data['responseConfig'];
    step['endFlow'] = data['endFlow'];

    return step;
  }

  deserialize(input: any): Step {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
