import { Deserializable } from '../../model/deserializable.interface';
import { Step } from './step.model';
import { UtilService } from '../../services/util.service';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  providers: [UtilService]
})
export class Conversation implements Deserializable<Conversation> {
  useCaseId: string;
  conversationFlowId: string;
  channel: string;
  flow: Array<Step>;
  exitPoint: Step;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  private cookieService: CookieService;
  private utilService: UtilService;

  constructor() {
    this.cookieService = new CookieService(document);
    this.utilService = new UtilService(this.cookieService);
  }

  mapFromApi(data: any): any {
    const conversation = {};
    conversation['useCaseId'] = data['useCaseId'];
    conversation['conversationFlowId'] = data['conversationFlowId'];
    conversation['channel'] = data['channel'];
    conversation['exitPoint'] = data['exitPoint'];

    if (data['flow']) {
      const flowSteps = data['flow'] || [];
      if (flowSteps.length) {
        conversation['flow'] = [];
        flowSteps.forEach(flow => {
          conversation['flow'].push(new Step().deserialize(flow));
        });
      }
    }
    conversation['createdBy'] = data['createdBy'];
    conversation['createdOn'] = data['createdOn'];
    conversation['updatedBy'] = data['updatedBy'];
    conversation['updatedOn'] = data['updatedOn'];
    return conversation;
  }

  mapToUpdateApi(data: any): any {
    return {
      useCaseId: data['useCaseId'],
      channel: data['channel'],
      updatedBy: this.utilService.getAdminFullName()
    };
  }

  mapToPutApi(data: any): any {
    return {
      useCaseId: data['useCaseId'],
      channel: data['channel'],
      createdBy: this.utilService.getAdminFullName(),
      updatedBy: this.utilService.getAdminFullName()
    };
  }

  deserialize(input: any): Conversation {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
