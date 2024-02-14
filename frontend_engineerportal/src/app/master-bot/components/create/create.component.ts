import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MasterBot } from '../../../model/master-bot';
import { MasterBotService } from '../../services/master-bot.service';
import { UtilService } from '../../../services/util.service';
import { APP_MESSAGE } from '../../../app-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'master-bot-create',
  styleUrls: ['create.component.sass'],
  templateUrl: 'create.component.html'
})

/**
 * @description - Component to create new Master Bot
 * @param {string} botType - Type of the bot either master or worker
 * @param {boolean} requestDone - To track API's call status, based on this to show Done/Save button
 * @param {FormGroup} masterBotForm - FormGroup referance to group controls for create master bot form
 * @param {MasterBot} masterBot - MasterBot model referance
 * @param {string} title - Current page title passed to navbar component as @Input
 * @param {string} prevPage - Previous page title  passed to navbar component as @Input
 * @param {boolean} errorOnSave - To keep errorpanel component display status
 * @param {string} errorMessage - To keep errors received from post apis response to pass errorpanel component
 * @param {string} toggleToolTipAISection - flag to enable/disable tooltip for AI Services section
 * @param {string} toggleToolTipInfoSection - flag to enable/disable tooltip for Bot Info section
 */
export class CreateComponent implements OnInit {
  botType: string;
  requestDone: boolean;
  masterBotForm: FormGroup;
  masterBot: MasterBot;
  title: string;
  prevPage: string;
  errorOnSave: boolean;
  errorMessage: any;
  savebuttonDisable: boolean;
  toggleToolTipAISection= false;
  toggleToolTipInfoSection = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private masterBotService: MasterBotService,
    private utilService: UtilService,
    private toasterService: ToastrService
  ) {
    this.botType = 'master';
    this.masterBot = new MasterBot();
    this.requestDone = false;
    this.title = 'New Master Bot Configuration';
    this.prevPage = 'Overall Performance';
    this.savebuttonDisable = false;
  }

  /**
   * @description - Component Life cycle hook called after component instance created.
   */
  ngOnInit(): void {
    this.initCreateForm();
    this.masterBotForm.valueChanges.subscribe(value => {
      if (this.requestDone) {
        this.requestDone = false;
      }
    });
  }

  /**
   * @description - to initiate master bot reactive form group object
   */
  initCreateForm(): void {
    this.masterBotForm = this.formBuilder.group({
      botImage: ['', Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{1,20}(:[0-9]{1,9})?(\/.*)?$/)],
      botName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^(?!\s*$).+/)]],
      botDescription: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      botLanguage: [''],
      botTelephoneNumber: ['', [Validators.maxLength(14), Validators.pattern(/^[+]?[0-9]{0,14}$/)]],
      botAuthentication: [false],
      NLPProvider: ['', Validators.required],
      STTProvider: [''],
      TTSProvider: [''],
      createdBy: this.utilService.getAdminFullName(),
      updatedBy: this.utilService.getAdminFullName()
    });
  }

  /**
   * @description - Navigate back to dashboard
   */
  back(): void {
    this.router.navigate(['dashboard']);
  }

  closeErrorPanel() {
    this.errorOnSave = false;
  }
  /**
   * @description - Method - Handler for listening to event for activate/deactivate tooltip for Master Bot Info section
   * @returns - void
   */
  toggleInfoToolTipHandler(): void {
    this.toggleToolTipInfoSection = !this.toggleToolTipInfoSection;
  }

  /**
   * @description - call the service to create new master bot
   */
  save(): void {
    this.savebuttonDisable = true;
    const postPayload = this.masterBot.mapToPostApi(this.masterBotForm.value);
    this.masterBotService.createMasterBot(postPayload).subscribe(
      (response: MasterBot) => {
        if (response.botId) {
          this.toasterService.success(APP_MESSAGE.BOT_SAVE_SUCCESS, 'Success');
          this.masterBotForm.reset();
          setTimeout(() => {
            this.requestDone = true;
          }, 0);
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        if(error.error.status === 400) {
          this.toasterService.error(error.error.message.replace('Bad Request.', ''), 'Failed');
          window.scrollTo(0, 0);
          this.savebuttonDisable = false;
        } else {
            const errorMessage = error.error.error.errors[0].messages.join();
            this.toasterService.error(errorMessage, 'Failed');
            window.scrollTo(0, 0);
            this.savebuttonDisable = false;
        }
         // log errors
      }
    );
  }
}
