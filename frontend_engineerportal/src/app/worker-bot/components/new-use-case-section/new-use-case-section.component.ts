import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { UseCases, IUseCases } from '../../../model/use-cases';
import { WorkerBotService } from '../../services/worker-bot.service';
import { UtilService } from '../../../services/util.service';
import {APP_MESSAGE} from "../../../app-constant";

@Component({
  selector: 'converse-new-use-case-section',
  styleUrls: ['new-use-case-section.component.sass'],
  templateUrl: 'new-use-case-section.component.html'
})

/**
 * @internal
 * This class is a  component that displays create master use case.
 *
 */
export class NewUseCaseSectionComponent implements OnInit {

  isAddButtonClicked: boolean;
  useCaseDetails: IUseCases;
  channels: Array<string>;
  requestDone: boolean;
  averageHumanHandlingDays: string;
  averageHumanHandlingHours: string;
  averageHumanHandlingMins: string;
  AHH: number;
  AHD: number;
  AHM: number;
  AHHT_error: boolean;
  AHHTErrorMsg: boolean
  hoursError: boolean;
  daysError: boolean;
  minsError: boolean;
  @Input() workerBotId: string;
  @Output() clickEventEmitter = new EventEmitter<string>();
  @Output() saveEventEmitter = new EventEmitter<IUseCases>();

  constructor(
    private workerBotService: WorkerBotService,
    private utilService: UtilService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.channels = [];
    this.initializeFields();
    this.resetAHHTErrors();
  }

  addNewUseCaseDialog(): void {
    this.isAddButtonClicked = true;
    this.clickEventEmitter.emit();
  }

  closeAddChannel(): void {
    this.isAddButtonClicked = false;
    this.initializeFields();
    this.resetAHHTErrors();
  }

  addChannels(channels): void {
    this.useCaseDetails.useCaseChannel = channels;
  }

  useCaseNameKeyUp() {
    this.useCaseDetails.useCaseName = this.useCaseDetails.useCaseName.replace(/^\s+/g, "");
   }

  saveUseCase(): void {
    const saveUseCaseArray = [];
    this.useCaseDetails.createdBy = this.utilService.getAdminFullName();
    const date = new Date();
    const dateTime: string = date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    this.useCaseDetails.updatedBy = this.utilService.getAdminFullName();
    this.useCaseDetails.workerBotId = this.workerBotId;
    this.useCaseDetails.averageHumanHandlingTime = this.setAverageHumanHandlingTime();
    if(this.AHHT_error == true) {
      this.AHHTErrorMsg = true;
      return;
    }
    saveUseCaseArray.push(this.useCaseDetails);
    this.updateUseCase(saveUseCaseArray);
    this.initializeFields();
    this.isAddButtonClicked = false;
  }

  setAverageHumanHandlingTime() {
    this.resetAHHTErrors();
    this.AHD = parseInt(this.averageHumanHandlingDays);
    this.AHH = parseInt(this.averageHumanHandlingHours);
    this.AHM = parseInt(this.averageHumanHandlingMins);
    if(this.AHD < 0 || this.AHD > 30) {
      this.AHHT_error = true;
      this.daysError =true;
    }
    if(this.AHH < 0 || this.AHH > 23) {
      this.AHHT_error = true;
      this.hoursError = true;
    }
    if(this.AHM < 0 || this.AHM > 59) {
      this.AHHT_error = true;
      this.minsError = true;
    }

    const avgDays = this.averageHumanHandlingDays ? this.averageHumanHandlingDays + '-' : '0-';
    const avgHours = this.averageHumanHandlingHours ? this.averageHumanHandlingHours + '-' : '0-';
    const avgMin = this.averageHumanHandlingMins || '0';
    return avgDays + avgHours + avgMin;
  }

  private updateUseCase(payload) {
    this.workerBotService.postUseCases(payload)
      .subscribe((response: UseCases) => {
        if (response) {
          this.saveEventEmitter.emit(this.useCaseDetails);
          this.requestDone = true;
          this.toastr.success(APP_MESSAGE.USECASE_SAVE_SUCCESS,'Success');
        }
      }, error => {
        // log errors
        if (error.error.status === 400) {
          this.toastr.error(error.error.message.replace('Bad Request.', ''), 'Failed');
          window.scrollTo(0, 0);
        } else {
          this.toastr.error(APP_MESSAGE.USECASE_SAVE_ERROR, 'Failed');
          window.scrollTo(0, 0);
        }
      });
  }

  private initializeFields() {
    this.useCaseDetails = {
      useCaseDescription: '',
      useCaseName: '',
      createdBy: '',
      updatedBy: '',
      collectFeedback: false,
    }
    this.averageHumanHandlingDays = '';
    this.averageHumanHandlingHours = '';
    this.averageHumanHandlingMins = '';
    this.AHHTErrorMsg = false;
  }

  resetAHHTErrors(): void {
    this.AHHTErrorMsg = false;
    this.hoursError = false;
    this.minsError = false;
    this.daysError = false;
    this.AHHT_error = false;
  }

  closeToaster(): void {
    this.AHHTErrorMsg = false;
  }
}
