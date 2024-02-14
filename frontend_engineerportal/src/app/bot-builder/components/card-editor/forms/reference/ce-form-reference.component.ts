import { Component, Output, EventEmitter } from '@angular/core';
import { UtilService } from '../../../../../services/util.service';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { MasterBotService } from 'src/app/master-bot/services/master-bot.service';
import { WorkerBot } from 'src/app/model/worker-bot';
import { UseCases } from 'src/app/model/use-cases';
import { ConversationService } from 'src/app/bot-builder/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { decideCardSubtitle } from '../../../../utilities/helper';
@Component({
  selector: 'ce-form-reference',
  styleUrls: ['../form-styles.sass'],
  templateUrl: 'ce-form-reference.component.html'
})

/**
 *
 */
export class CEReferenceFormComponent {
  @Output()
  eventOutput = new EventEmitter();
  workerBotOptions: any[];
  useCaseOptions: any[];
  responseOptions: any[];
  workerbot: any;
  usecase: any;
  useCaseName: string;
  responseNode: any;
  responseNodeName: any;

  constructor(
    private utilService: UtilService,
    private masterBotService: MasterBotService,
    private workerBotService: WorkerBotService,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {
    const masterBotId = JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;

    this.masterBotService.listWorkerBots(masterBotId).subscribe(async (workerBots: Array<WorkerBot>) => {
      this.workerBotOptions = workerBots.map(item => {
        return { key: item.botId, colName: item.botName };
      });
    });
  }

  /**
   * @description handles selection change for worker bot dropdown
   * @param data selected workerbot
   */
  onSelChangeWorkerBot(data) {
    this.workerbot = data;
    this.workerBotService.getListUseCases(data.key).subscribe(async (useCases: Array<UseCases>) => {
      this.useCaseOptions = useCases.map(item => {
        return { key: item.useCaseId, colName: item.useCaseName };
      });
    });

    this.useCaseName = null;
    this.usecase = null;
  }

  /**
   * @description handles selection change for use case dropdown
   * @param data selected use case
   */
  onSelChangeUseCase(data) {
    this.usecase = data;
    this.useCaseName = data.colName;
    this.workerBotService.listConversationFlows(data.key).subscribe(async (flows: Array<UseCases>) => {
      const currentChannel = this.conversationService.getConversationData().getValue()['channel'];
      const convFlow = flows.find(item => item['channel'] === currentChannel);
      if (convFlow) {
        this.conversationService.getConversation(convFlow['conversationFlowId']).subscribe(flow => {
          this.responseOptions = flow['flow']
            .filter(item => item.owner === 'bot')
            .map(item => {
              return { key: item.currentStep, colName: item['description'][0], label: decideCardSubtitle(item.responseType) };
            });
        });
      } else {
        this.toastr.error('Use case does not have a con versation flow in ' + currentChannel + ' channel');
      }
    });
  }

  /**
   * @description handles selection change for response node
   * @param data selected response node
   */
  onSelChangeResponseNode(data) {
    this.responseNode = data;
    this.responseNodeName = data.colName;
  }

  /**
   * @description handles saving the reference
   */
  handleSave() {
    if (this.workerbot && this.usecase && this.responseNode) {
      this.eventOutput.emit({
        action: 'saveReference',
        form: { workerbot: this.workerbot, usecase: this.usecase, responseNode: this.responseNode }
      });
    }
  }

  /**
   * @description handles the cancel button click
   */
  handleCancel() {
    this.eventOutput.emit({
      action: 'closeSideBar'
    });
  }
}
