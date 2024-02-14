import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { NLP, STT, TTS } from '../../../app-constant';
import { MasterBot } from '../../../model/master-bot';
import { MasterBotService } from '../../services/master-bot.service';
import { APP_MESSAGE } from '../../../app-constant';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'master-bot-configure',
  styleUrls: ['configure.component.sass'],
  templateUrl: 'configure.component.html'
})
/**
 * @description  Component to display master bot configuration.
 * @param {string} botType - to define type of bot worker/master.
 * @param {FormGroup} masterBotForm - FormGroup instance to group all form controls to config masterbot form
 *
 * @param {string} masterBotId - master bot ID received from url parameters & used to get bot details
 * @param {WorkerBot} masterBot - worker bot Object to hold bot details
 * @param {string} NLPProvider - Bot NLP provider name
 * @param {string} STTProvider - Bot STT provider name
 * @param {string} TTSProvider - Bot TTS provider name
 * @param {string} title - Current page title
 * @param {string} performancePageTitle - Bot perfomance page link title to show on page
 * @param {string} prevPage - Previous page link title
 * @param {boolean} errorOnSave - To keep errorpanel component display status
 * @param {string} errorMessage - To keep errors received from post apis response to pass errorpanel component
 * @param {Subscription} activeRouteSubscriber - route params subscription
 * @param {Subscription} deleteMasterBotSubscription - delete workerbot api subscription
 * @param {boolean} askToDelete - to keep status master bot delete popup modal
 * @param {boolean} toolTipFlag - flag to enable/disable tooltip sections
 */
export class ConfigureComponent implements OnInit, OnDestroy {
  botType: string;
  masterBotForm: FormGroup;
  masterBotId: string;
  masterBot: MasterBot;
  NLPProvider: string;
  STTProvider: string;
  TTSProvider: string;
  title: string;
  performancePageTitle: string;
  prevPage: string;
  errorOnSave: boolean;
  errorMessage: string;
  private activeRouteSubscriber: Subscription;
  private deleteMasterBotSubscription: Subscription;
  askToDelete: boolean;
  toolTipFlag = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private masterBotService: MasterBotService,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private ngxSmartModalService: NgxSmartModalService
  ) {
    this.askToDelete = false;
    this.botType = 'master';
  }

  ngOnInit() {
    this.activeRouteSubscriber = this.route.params.subscribe((params: Params) => {
      this.masterBotId = params['id'];
    });
    this.getMasterBot(this.masterBotId);
    this.prevPage = 'Overall Performance';
    this.initForm();
  }

  /**
   * @description to set Page Navigation titles
   */
  private setPageNavtitle(): void {
    this.title = this.masterBot.botName + ' Configuration';
    this.performancePageTitle = this.masterBot.botName + "'s Performance";
  }

  /**
   * @description get bot configuration data from service
   * @param {string} botID - Master Bot ID
   */
  private getMasterBot(botId: string): void {
    this.masterBotService.getMasterBot(botId).subscribe(
      (bot: MasterBot) => {
        this.masterBot = bot;
        this.utilService.setSessionStorage('currentMasterBot', { id: this.masterBot.botId, name: this.masterBot.botName });
        this.setPageNavtitle();
        if (this.masterBot.STTProvider) {
          this.STTProvider = STT.find(obj => obj.value === this.masterBot.STTProvider).key;
        }
        if (this.masterBot.TTSProvider) {
          this.TTSProvider = TTS.find(obj => obj.value === this.masterBot.TTSProvider).key;
        }
        if (this.masterBot.NLPProvider) {
          this.NLPProvider = NLP.find(obj => obj.value === this.masterBot.NLPProvider).key;
        }
        this.masterBotForm.patchValue(this.masterBot);
        sessionStorage.setItem(this.masterBotId, this.masterBot.botName);
      },
      (error: any) => {
        this.back();
        // log error
      }
    );
  }

  /**
   * @description to update master bot reactive form group object
   */
  initForm(): void {
    this.masterBotForm = this.formBuilder.group({
      botId: this.masterBotId,
      botImage: ['', Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{1,20}(:[0-9]{1,9})?(\/.*)?$/)],
      botName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^(?!\s*$).+/)]],
      botDescription: ['', Validators.required],
      botLanguage: [''],
      botTelephoneNumber: ['', [Validators.maxLength(14), Validators.pattern(/^[+]?[0-9]{0,14}$/)]],
      botAuthentication: [false],
      botStatus: [false],
      updatedBy: this.utilService.getAdminFullName(),
      adminUserId: this.utilService.getAdminId()
    });
  }

  /**
   * @description Navigate back to dashboard
   */
  back(): void {
    this.router.navigate(['dashboard']);
  }

  /**
   * @description Navigate to master bot performance page
   */
  navigateToBotPerformance() {
    this.router.navigate(['masterbot', this.masterBotId, 'performance']);
  }

  /**
   * @description to update master bot details
   */
  update() {
    const masterBotFormData = this.masterBotForm.value;
    const masterBot = Object.assign({}, this.masterBot, masterBotFormData);
    const putPayload = this.masterBot.mapToUpdateApi(masterBot);
    this.errorOnSave = false;
    this.errorMessage = '';
    this.masterBotService.updateMasterBot(putPayload).subscribe(
      (response: MasterBot) => {
        this.masterBotForm.markAsPristine();
        this.masterBot = response;
        this.setPageNavtitle();
        this.masterBotForm.patchValue(this.masterBot);
        this.toastr.success('Bot Info saved successfully', 'Success');
      },
      error => {
        const errorMessage = error.error.error.errors[0].messages.join();
        this.toastr.error(errorMessage, 'Failed');
        window.scrollTo(0, 0);
        // log errors
      }
    );
  }

  /**
   * @description error panel component output event handler
   */
  closeErrorPanel() {
    this.errorOnSave = false;
  }

  /**
   * @description - Method - To confirm delete master bot
   */
  askToUser(): void {
    this.askToDelete = true;
  }

  /**
   * @description - Method - To handle user selection
   * @returns - void
   */
  handleConfirmEvent(confirmedToDelete: boolean): void {
    this.askToDelete = false;
    if (confirmedToDelete) {
      this.deleteMasterrBot(this.masterBotId);
    }
  }

  /**
   * @description - Method - To delete master bot
   * @param {string} masterBotId - masterBotId to be delete
   * @returns - void
   */
  private deleteMasterrBot(masterBotId: string): void {
    this.deleteMasterBotSubscription = this.masterBotService.deleteMasterBot(masterBotId).subscribe((response) => {
      // show toaster message a
      this.toastr.success(APP_MESSAGE.DELETE_MASTERBOT_SUCCESS, 'Success');
      this.back();
    }, (error: any) => {
      // Log error or throw error
      this.toastr.error(APP_MESSAGE.DELETE_MASTERBOT_FAILED, 'Failed');
    })
  }
  /**
   * @description - Method - To activate/deactivate tooltip mode
   * @param {boolean} data - flag to set the visibility
   * @returns - void
   */
  public toggleEditSectionToolTip(data: boolean): void {
    this.toolTipFlag = data;
  }

  ngOnDestroy(): void {
    if (this.activeRouteSubscriber) {
      this.activeRouteSubscriber.unsubscribe();
    }
    if (this.deleteMasterBotSubscription) {
      this.deleteMasterBotSubscription.unsubscribe();
    }
  }
}
