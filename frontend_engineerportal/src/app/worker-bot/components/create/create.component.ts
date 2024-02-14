import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

import { WorkerBot } from '../../../model/worker-bot';
import { MasterBot } from '../../../model/master-bot';
import { WorkerBotService } from '../../services/worker-bot.service';
import { UtilService } from '../../../services/util.service';
import { APP_MESSAGE } from '../../../app-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'worker-bot-create',
  styleUrls: ['create.component.sass'],
  templateUrl: 'create.component.html'
})
/**
 * @description - Component to create new Worker Bot
 * @param {string} masterBotId - Master Bot Id fow which creating worker bot
 * @param {string} botType - Type of the bot either master or worker
 * @param {boolean} requestDone - To track API's call status, based on this to show Done/Save button
 * @param {FormGroup} workerBotForm - FormGroup referance to group controls for create worker bot form
 * @param {MasterBot} masterBot - MasterBot model referance
 * @param {WorkerBot} workerBot - WorkerBot model referance
 * @param {string} title - Current page title passed to navbar component as @Input
 * @param {string} prevPage - Previous page title  passed to navbar component as @Input
 * @param {Subscription} activeRouteSubscriber - Active route subscription
 * @param {Subscription} masterBotSubscription - Obserbable subscription
 * @param {string} toggleToolTipAISection - flag to enable/disable tooltip for AI Services section
 * @param {string} toggleToolTipBotInfo - flag to enable/disable tooltip for Bot Info section
 */
export class CreateComponent implements OnInit, OnDestroy {
  masterBotId: string;
  botType: string;
  workerBotForm: FormGroup;
  requestDone: boolean;
  workerBot: WorkerBot;
  masterBot: MasterBot;
  prevPage: string;
  title: string;
  errorOnSave: boolean;
  errorMessage: string;
  savebuttonDisable: boolean;
  // Subscribers
  activeRouteSubscriber: Subscription;
  masterBotSubscription: Subscription;
  toggleToolTipAISection = false;
  toggleToolTipBotInfo = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private workerBotService: WorkerBotService,
    private utilService: UtilService,
    private toasterService: ToastrService
  ) {
    this.botType = 'Worker';
    this.requestDone = false;
    this.workerBot = new WorkerBot();
    this.masterBot = new MasterBot();
    this.savebuttonDisable = false;
  }

  ngOnInit() {
    this.activeRouteSubscriber = this.route.queryParams.subscribe((params: Params) => {
      this.masterBotId = params['masterBotID'];
    });

    if (!this.masterBotId) {
      this.backToDashboard();
    }
    this.getMasterBot(this.masterBotId);

    this.initCreateForm();
    this.workerBotForm.valueChanges.subscribe(value => {
      if (this.requestDone) {
        this.requestDone = false;
      }
    });
    this.title = 'New ' + this.botType + ' Bot Configuration';
  }

  /**
   * @description to get masterbot details
   *  based on the received masterBotId in component
   */
  getMasterBot(botID: string): void {
    this.masterBotSubscription = this.workerBotService.getMasterBot(botID).subscribe(
      (bot: MasterBot) => {
        this.masterBot = bot;
        this.prevPage = this.masterBot.botName + "''s Performance";

        // this.masterBotId = this.masterBot.botId;
        this.workerBotForm.patchValue({
          masterBotId: this.masterBot.botId
        });
      },
      (error: any) => {
        // log error
        this.backToDashboard();
      }
    );
  }

  closeErrorPanel() {
    this.errorOnSave = false;
  }

  /**
   * @description to create master bot reactive form group object
   */
  initCreateForm(): void {
    this.workerBotForm = this.formBuilder.group({
      masterBotId: this.masterBotId,
      botName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^(?!\s*$).+/)]],
      botDescription: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      botLanguage: [''],
      botAuthentication: [false],
      NLPProvider: ['', Validators.required],
      STTProvider: [''],
      TTSProvider: [''],
      createdBy: this.utilService.getAdminFullName(),
      updatedBy: this.utilService.getAdminFullName()
    });
  }

  /**
   * @description To create new workerbot
   * */
  save() {
    this.savebuttonDisable = true;
    const postPayload = this.workerBot.mapToPostApi(this.workerBotForm.value);
    this.workerBotService.createWorkerBot(postPayload).subscribe(
      (response: WorkerBot) => {
        if (response.botId) {
          this.toasterService.success(APP_MESSAGE.BOT_SAVE_SUCCESS, 'Success');
          this.workerBotForm.reset();
          setTimeout(() => {
            this.requestDone = true;
            this.router.navigate(['masterbot', this.masterBotId]);
          }, 0);
        }
      },
      error => {
        // log errors
        if (error.error.status === 400) {
          this.toasterService.error(error.error.message.replace('Bad Request.', ''), 'Failed');
          window.scrollTo(0, 0);
          this.savebuttonDisable = false;
        } else {
          this.toasterService.error(APP_MESSAGE.BOT_SAVE_ERROR, 'Failed');
          this.savebuttonDisable = false;
        }
      }
    );
  }

  /**
   * @description Navigate back to masterbot page
   * @param botID
   */
  back(): void {
    this.router.navigate(['masterbot', this.masterBotId]);
  }

  /**
   * @description Navigate back to dashboard page
   * @param botID
   */
  backToDashboard(): void {
    this.router.navigate(['dashboard']);
  }
  /**
   * @description - Method - to activate/deactivate tooltip for Worker Bot Info section
   * @param {boolean} data - flag to set the visibility
   * @returns - void
   */
  activateTTBotInfo(data: boolean): void {
    this.toggleToolTipBotInfo = data;
  }

  /**
   * @description Component Life cycle hook called
   * 	just before component instance destroyed.
   * */
  ngOnDestroy(): void {
    this.activeRouteSubscriber.unsubscribe();
    this.masterBotSubscription.unsubscribe();
  }
}
