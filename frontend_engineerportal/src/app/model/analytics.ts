import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

export interface AutomationData {
  useCases: number;
  automationRate: number;
}

export interface EscalationData {
  useCases: number;
  escalationRate: number;
}

export interface CustomerSatisfaction {
  feedbackRequested: number;
  verySatisfied: number;
  satisfied: number;
  unsatisfied: number;
  veryUnsatisfied: number;
  noFeedback: number;
  botRating: number;
}

export interface IntentMatched {
  intents: number;
  intentsMatched: number;
}

export  class Analytics implements Deserializable<Analytics>, ApiMapperInterface {
  automationData: AutomationData;
  escalationData: EscalationData;
  customerSatisfaction: CustomerSatisfaction;

  mapFromApi(data: any) {
   
    if(data['automationData']){
      this.automationData = data['automationData'];
    }
    if(data['escalationData']){
      this.escalationData = data['escalationData'];
    }
    if(data['CustomerSatisfaction']){
      this.customerSatisfaction = data['CustomerSatisfaction'];
    }
    
    return this;
  }

  deserialize(input: any): Analytics {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}