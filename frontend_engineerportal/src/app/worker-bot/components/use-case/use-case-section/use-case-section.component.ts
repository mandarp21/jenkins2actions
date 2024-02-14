import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { UtilService } from '../../../../services/util.service';
import { ExportService } from '../../../../services/export.service';
import { WorkerBotService } from '../../../services/worker-bot.service';
import { UseCases, IGetUseCases } from '../../../../model/use-cases';
import { ToastrService } from 'ngx-toastr';
import {APP_MESSAGE, USECASES} from "../../../../app-constant";
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'converse-use-case-section',
  styleUrls: ['use-case-section.component.sass'],
  templateUrl: 'use-case-section.component.html'
})

/**
 * @internal
 * This class is a  component that displays create master use case.
 *
 */
export class UseCaseSectionComponent implements OnInit {
  channels: Array<string> = [];
  @Input()
  useCaseDetails: UseCases;
  channelsString: string;
  isEditFlow: boolean;
  useCaseEditDetails: IGetUseCases;
  requestDone: boolean;
  averageHumanHandlingString: string;
  averageHumanHandlingDays: string;
  averageHumanHandlingHours: string;
  averageHumanHandlingMins: string;
  @Input()
  workerBotId: string;
  @Output()
  removeEventEmitter = new EventEmitter();
  @Output()
  saveEditEventEmitter = new EventEmitter();
  askToDelete: boolean;
  useCaseId: string;
  AHH: number;
  AHD: number;
  AHM: number;
  AHHT_error: boolean;
  AHHTErrorMsg: boolean;
  daysError: boolean;
  minsError: boolean;
  hoursError: boolean;
  avgHandlingArray: Array<string> = [];
  constructor(private router: Router, private utilService: UtilService, private workerBotService: WorkerBotService,
              private toastr: ToastrService, private exportService: ExportService, private _FileSaverService: FileSaverService) {
    this.averageHumanHandlingString = '';
  }

  /**
   * @description Oninit Lifecycle Changes
   */
  ngOnInit() {
    this.resetAHHTError();
    this.splitAverageHandlingTime();
    if (this.useCaseDetails && (!this.useCaseDetails.useCaseChannel || this.useCaseDetails.useCaseChannel.length == 0)) {
      this.channelsString = 'NA';
    }

    if (this.useCaseDetails.useCaseChannel && this.useCaseDetails.useCaseChannel.length !== 0)
      this.channelsString = this.useCaseDetails.useCaseChannel.join();
  }

  splitAverageHandlingTime() {
    if (this.useCaseDetails.averageHumanHandlingTime) {
      this.avgHandlingArray = this.useCaseDetails.averageHumanHandlingTime.split('-');
      this.averageHumanHandlingDays = this.avgHandlingArray[0] ? this.avgHandlingArray[0] : '0';
      this.averageHumanHandlingHours = this.avgHandlingArray[1] ? this.avgHandlingArray[1] : '0';
      this.averageHumanHandlingMins = this.avgHandlingArray[2] ? this.avgHandlingArray[2] : '0';

      if (this.averageHumanHandlingDays !== '0') {
        this.averageHumanHandlingString += this.averageHumanHandlingDays + 'd ';
      }
      if (this.averageHumanHandlingHours !== '0') {
        this.averageHumanHandlingString += this.averageHumanHandlingHours + 'h ';
      }
      if (this.averageHumanHandlingMins !== '0') {
        this.averageHumanHandlingString += this.averageHumanHandlingMins + 'm ';
      }
    }
  }
  /**
   * @method editUseCase
   * @description Make Use case section editable
   */
  editUseCase(): void {
    this.isEditFlow = true;
    if (this.useCaseDetails) {
      //to maintain AHHT values on clearing them and clicking of cancel button in edit use case flow
      this.avgHandlingArray = this.useCaseDetails.averageHumanHandlingTime.split('-');
      this.averageHumanHandlingDays = this.avgHandlingArray[0] ? this.avgHandlingArray[0] : '0';
      this.averageHumanHandlingHours = this.avgHandlingArray[1] ? this.avgHandlingArray[1] : '0';
      this.averageHumanHandlingMins = this.avgHandlingArray[2] ? this.avgHandlingArray[2] : '0';
      this.useCaseEditDetails = {
        useCaseId: this.useCaseDetails.useCaseId,
        useCaseName: this.useCaseDetails.useCaseName,
        useCaseDescription: this.useCaseDetails.useCaseDescription,
        createdBy: this.useCaseDetails.createdBy,
        updatedBy: this.useCaseDetails.updatedBy,
        averageHumanHandlingTime: this.useCaseDetails.averageHumanHandlingTime,
        collectFeedback: this.useCaseDetails.collectFeedback,
        useCaseChannel: this.useCaseDetails.useCaseChannel
      };
    }
    // Object.assign(this.useCaseEditDetails, this.useCaseDetails)
    // this.useCaseEditDetails = this.useCaseDetails;
  }

  /**
   * @method createFlow
   * @description Navigates to conversation entry flow on click of create flow
   */
  createFlow(): void {
    this.utilService.setSessionStorage('currentUseCase', this.useCaseDetails.useCaseName);
    this.router.navigate(['usecase', this.useCaseDetails.useCaseId, 'conversation', 'channel']);
  }

  /**
   * @method editFlow
   * @description Navigates to conversation flow on click of edit flow button
   */
  editFlow(): void {
    this.utilService.setSessionStorage('currentUseCase', this.useCaseDetails.useCaseName);
    this.workerBotService.listConversationFlows(this.useCaseDetails.useCaseId).subscribe(
      response => {
        const flow = response[0];
        this.router.navigate(['conversation/view', flow['conversationFlowId']]);
      },
      error => {
        // log error
        // show message unable to redirect on conversation flow page
      }
    );
  }

  /**
   * @method closeAddChannel
   * @description Cancels Edit Flow
   */
  closeAddChannel(): void {
    this.isEditFlow = false;
    this.resetAHHTError();
  }

  /**
   * @method addChannels
   * @description Adds new channels
   */
  addChannels(channels): void {
    this.useCaseEditDetails.useCaseChannel = channels;
  }

  /**
   * @description - Method - To confirm delete worker bot
   */
  askToUser(useCaseId: string): void {
    this.askToDelete = true;
    this.useCaseId = useCaseId;
  }

  /**
   * @description - Method - To handle user selection
   * @returns - void
   */
  handleConfirmEvent(confirmedToDelete: boolean, ): void {
    this.askToDelete = false;
    if (confirmedToDelete) {
      this.remove(this.useCaseId);
    }
    this.useCaseId = undefined;
  }

  /**
   * @method remove
   * @description Removes respective use case
   */
  remove(useCaseId): void {
    this.removeEventEmitter.emit(useCaseId);
  }

  /**
   * @method saveUseCase
   * @description Constructs payload for saving Use Case
   */
  saveUseCase(): void {
    const date = new Date();
    const dateTime: string =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    // this.useCaseEditDetails.updatedOn = dateTime;
    this.useCaseEditDetails.updatedBy = this.utilService.getAdminFullName();
    // this.useCaseEditDetails.workerBotId = this.workerBotId;
    this.useCaseEditDetails.averageHumanHandlingTime = this.setAverageHumanHandlingTime();
    if(this.AHHT_error == true) {
      this.AHHTErrorMsg = true;
      return;
    }
    this.workerBotService.updateUseCases(this.useCaseEditDetails).subscribe(
      (response: UseCases) => {
        if (response) {
          this.saveEditEventEmitter.emit();
          this.requestDone = true;
        }
      },
      error => {
        // log errors
        if (error.error.status === 400) {
          this.toastr.error(error.error.message.replace('Bad Request.', ''), 'Failed');
          window.scrollTo(0, 0);
        } else {
          this.toastr.error(APP_MESSAGE.USECASE_SAVE_ERROR, 'Failed');
          window.scrollTo(0, 0);
        }
      }
    );
    this.initializeFields();
    this.isEditFlow = false;

    this.channelsString = 'NA';
  }

  /**
   * @method setAverageHumanHandlingTime
   * @description constructs average human handling time
   * @return string
   */
  setAverageHumanHandlingTime(): string {
    this.resetAHHTError();
    this.AHD = parseInt(this.averageHumanHandlingDays);
    this.AHH = parseInt(this.averageHumanHandlingHours);
    this.AHM = parseInt(this.averageHumanHandlingMins);
    if(this.AHD < 0 || this.AHD > 30) {
      this.AHHT_error = true;
      this.daysError = true;
    }if(this.AHH < 0 || this.AHH > 23) {
      this.AHHT_error = true;
      this.hoursError = true;
    }if(this.AHM < 0 || this.AHM > 59) {
      this.AHHT_error = true;
      this.minsError = true;
     }
    const avgDays = this.averageHumanHandlingDays ? this.averageHumanHandlingDays + '-' : '0-';
    const avgHours = this.averageHumanHandlingHours ? this.averageHumanHandlingHours + '-' : '0-';
    const avgMin = this.averageHumanHandlingMins || '0';
    return avgDays + avgHours + avgMin;
  }

  /**
   * @method initializeFields
   * @description Clear Fieds
   */
  initializeFields(): void {
    this.useCaseEditDetails = {
      useCaseId: '',
      useCaseDescription: '',
      useCaseName: '',
      createdBy: '',
      useCaseChannel: [],
      averageHumanHandlingTime: '',
      updatedBy: '',
      collectFeedback: false
    };
  }

  useCaseNameKeyUp() {
    this.useCaseEditDetails.useCaseName = this.useCaseEditDetails.useCaseName.replace(/^\s+/g, "");
   }

  /**
   * @method isUseCaseDeletable
   * @description checks if the usecase can be deletable
   * @return boolean
   */

  isUseCaseDeletable(useCaseName) {
    return USECASES.NON_DELETABLE_USECASES.indexOf(useCaseName) === -1;
  }
  /**
   * @method exportUseCase
   * @description exports the use case in a JSON file and downloads it
   */

  exportUseCase(useCaseId: string) {
    const payload = {};
    const useCaseIds = [];
    useCaseIds.push(useCaseId);
    payload['usecaseId'] = useCaseIds;
    payload['workerbotId'] = this.workerBotId;
    this.exportService.exportAndDownload('EXPORT_USECASES', payload).subscribe((response) => {
      console.log('Response', response);
      if (response) {
        const fileName = this.exportService.getFileName(response.headers.get('Content-Disposition'));
        this._FileSaverService.save(response.body, fileName);
      } else {
        this.toastr.error('Error occured while exporting Use Cases', 'FAILED');
      }
    }, (error) => {
      if (error){
        this.toastr.error('Error occured while exporting Use Cases', 'FAILED');
      }
    });
  }
  resetAHHTError(): void {
    this.AHHTErrorMsg = false;
    this.minsError = false;
    this.daysError = false;
    this.hoursError = false;
    this.AHHT_error = false;
  }

  closeToaster(): void {
    this.AHHTErrorMsg = false;
  }
}
