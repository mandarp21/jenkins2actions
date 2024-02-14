import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { WorkerBotService } from '../../services/worker-bot.service';
import { WorkerBot } from '../../../model/worker-bot';
import { Intent } from 'src/app/model/intent';
import { UtilService } from '../../../services/util.service';
import { APP_MESSAGE } from '../../../app-constant';

@Component({
  selector: 'converse-configuration',
  styleUrls: ['configuration.component.sass'],
  templateUrl: 'configuration.component.html'
})

/**
 * @description  Component to display worker bot configuration.
 * @param {string} botType - to define type of bot worker/master.
 * @param {string} workerBotId - worker bot ID received from url parameters & used to get bot details
 * @param {WorkerBot} workerBot - worker bot Object to hold bot details
 * @param {any} associatedIntents - // TODO
 * @param {Array<Intent>} nlpIntentsList - Array of nlp intents associated with worker bot
 * @param {FormGroup} workerBotForm - FormGroup instance to group all form controls to config workerbot form
 * @param {Subscription} workerBotSubscription - workerbot service observable subscription
 * @param {Subscription} workerBotFormSubscription - workerbot form valuechange subscription
 * @param {Subscription} deleteWorkerBotSubscription - delete workerbot api subscription
 * @param {boolean} askToDelete - to keep status worker bot delete popup modal
 * @param {boolean} toggleToolTipWorkerAI - to keep status worker bot delete popup modal
 * @param {boolean} toggleToolTipWBotInfo - to keep status worker bot delete popup modal
 */
export class ConfigurationComponent implements OnInit, OnDestroy {
  botType: string;
  workerBotId: string;
  workerBot: WorkerBot;
  associatedIntents: Array<string>;
  nlpIntentsList: Array<Intent>;
  workerBotForm: FormGroup;
  private workerBotSubscription: Subscription;
  private workerBotFormSubscription: Subscription;
  private deleteWorkerBotSubscription: Subscription;
  errorOnSave: boolean;
  errorMessage: string;
  askToDelete: boolean;
  toggleToolTipWorkerAI = false;
  toggleToolTipWBotInfo = false;
  isFormSubmitted: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private workerBotService: WorkerBotService,
    private formBuilder: FormBuilder,
    private utilService: UtilService
  ) {
    this.botType = 'worker';
    this.askToDelete = false;
    this.isFormSubmitted = false;
    this.workerBot = new WorkerBot();
  }

  ngOnInit(): void {
    this.isFormSubmitted = false;
    this.workerBotId = this.route.parent.snapshot.paramMap.get('id');

    this.initForm();
    this.workerBotFormSubscription = this.workerBotForm.valueChanges.subscribe(value => {
      if (
        (value.TTSProvider !== '' && value.TTSProvider !== this.workerBot.TTSProvider) ||
        (value.STTProvider !== '' && value.STTProvider !== this.workerBot.STTProvider) ||
        (value.NLPProvider !== '' && value.NLPProvider !== this.workerBot.NLPProvider)
      ) {
        this.workerBotForm.markAsDirty();
      }
    });
    // Get the default worker bot
    const defaultWorkerBot = JSON.parse(this.utilService.getSessionStorage('defaultWorkerBotId'));
    const defaultWorkerBotId = defaultWorkerBot ? defaultWorkerBot.id : '';

    // Subscribe the workerbot data
    this.workerBotSubscription = this.workerBotService.workerBot$.subscribe((workerBot: WorkerBot) => {
      this.workerBot = workerBot;
      this.workerBotForm.patchValue(this.workerBot);
      this.associatedIntents = this.workerBot.associatedIntents;
      this.getIntentList(defaultWorkerBotId);
    });

    // Fetch the list of intents using worker bot
    this.getIntentList(defaultWorkerBotId);
  }

  /**
   * @description get intent list
   * @param { defaultWorkerBotId }- string
   */

  getIntentList(defaultWorkerBotId: string) {
    this.workerBotService.getListIntents(defaultWorkerBotId).subscribe(
      (data: any) => {
        // To sort intents in alphabetic order on load
        data = this.utilService.sortArray(data, 'intentName', 'asc');
        this.nlpIntentsList = data;
        this.nlpIntentsList.forEach((intent: Intent) => {
          const matchedIndex = this.associatedIntents.findIndex(element => {
            return element === intent.intentName;
          });
          intent.selected = matchedIndex !== -1 ? true : false;
        });
      },
      error => {
        // log errors
        this.nlpIntentsList = [];
      }
    );
  }

  /**
   * @description to update worker bot reactive form group object
   */
  initForm(): void {
    this.workerBotForm = this.formBuilder.group({
      botId: this.workerBotId,
      botName: ['', [Validators.required, Validators.maxLength(30)]],
      botDescription: ['', Validators.required],
      botLanguage: [''],
      botAuthentication: [false],
      botStatus: [false],
      NLPProvider: ['', Validators.required],
      STTProvider: '',
      TTSProvider: '',
      associatedIntents: [],
      associatedEntities: [],
      updatedBy: this.utilService.getAdminFullName()
    });
  }

  /**
   * @description updated the associated intent list here
   */
  buildIntentList(intentList) {
    this.associatedIntents = [];
    intentList.forEach((item: any) => {
      this.associatedIntents.push(item.intentName);
    });
    this.workerBotForm.markAsDirty({ onlySelf: true });
    this.workerBotForm.patchValue(
      {
        associatedIntents: this.associatedIntents
      },
      { emitEvent: true }
    );
  }

  /**
   * @description - To update worker bot data
   */
  update() {
    this.isFormSubmitted = true;
    const workerBotFormData = this.workerBotForm.value;
    let isNLPConfigChanged = false;
    // On Change NLP uncheck or reset the associated intent list
    if (workerBotFormData.NLPProvider !== this.workerBot.NLPProvider) {
      isNLPConfigChanged = true;
    } else {
      // NLP same && check for credentials change
      const nlpIndex: any = this.workerBot.nlpConfig.findIndex(nlpConfig => {
        return nlpConfig.provider === workerBotFormData.NLPProvider;
      });
      for (const key in workerBotFormData.nlpConfig) {
        if (workerBotFormData.nlpConfig[key] !== this.workerBot.nlpConfig[nlpIndex].config[key]) {
          isNLPConfigChanged = true;
        }
      }
    }
    const workerBot = Object.assign({}, this.workerBot, workerBotFormData);
    workerBot.associatedIntents = !isNLPConfigChanged ? this.associatedIntents : [];
    const putPayload = this.workerBot.mapToPutApi(workerBot);
    this.workerBotService.updateWorkerBot(putPayload).subscribe(
      (response: WorkerBot) => {
        this.workerBotService.publishWorkerBot(response);
        this.errorOnSave = false;
        this.isFormSubmitted = false;
        this.errorMessage = '';
        this.toastr.success(APP_MESSAGE.BOT_SAVE_SUCCESS, 'Success');
        this.workerBotForm.markAsPristine();
      },
      error => {
        // log errors
        if (error.error.status === 400) {
          this.toastr.error(error.error.message.replace('Bad Request.', ''), 'Failed');
          window.scrollTo(0, 0);
        } else {
          this.toastr.error(APP_MESSAGE.BOT_SAVE_ERROR, 'Failed');
        }
        this.isFormSubmitted = false;
      }
    );
  }

  /**
   * @description - Method - back() - To navigate masterbot performance page
   */
  back() {
    this.router.navigate(['masterbot', this.workerBot.masterBotId]);
    // TODO Fixed build error, functionality to be added
  }

  closeErrorPanel(): void {
    this.errorOnSave = false;
  }

  /**
   * @description - Method - To confirm delete worker bot
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
      this.deleteWorkerBot(this.workerBotId);
    }
  }

  /**
   * @description - Method - To delete worker bot
   * @param {string} workerBotId - workerBotId to be delete
   * @returns - void
   */
  private deleteWorkerBot(workerBotId: string): void {
    this.deleteWorkerBotSubscription = this.workerBotService.deleteWorkerBot(workerBotId).subscribe(
      response => {
        // show toaster message a
        this.toastr.success(APP_MESSAGE.DELETE_WORKERBOT_SUCCESS, 'Success');
        this.back();
      },
      (error: any) => {
        // Log error or throw errorerror.message
        this.toastr.error(error.error.message.replace('Bad Request.', ''), 'Failed');
      }
    );
  }
  /**
   * @description - Method - To activate/deactivate tooltip mode for Worker bot
   * @param {boolean} data - flag to set the visibility
   * @returns - void
   */
  toggleToolTipBotInfo(data: boolean): void {
    this.toggleToolTipWBotInfo = data;
  }
  /**
   * @description - Method - ngOnDestroy() - Framwork lifecycle hook called just before the component instace destroyed.
   */
  ngOnDestroy(): void {
    this.workerBotSubscription.unsubscribe();
    this.workerBotFormSubscription.unsubscribe();
    if (this.deleteWorkerBotSubscription) {
      this.deleteWorkerBotSubscription.unsubscribe();
    }
  }
}
