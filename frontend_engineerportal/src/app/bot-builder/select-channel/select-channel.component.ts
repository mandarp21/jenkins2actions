import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../model/conversation.model';
import { UseCases } from '../../model/use-cases';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'select-channel',
  styleUrls: ['select-channel.component.sass'],
  templateUrl: 'select-channel.component.html'
})

/**
 * @internal
 * This class is a  component that displays the exit step for creating a conversation flow
 *
 */
export class SelectChannelComponent implements OnInit, OnDestroy {
  channels = ['skype', 'teams', 'facebook', 'voice', 'web', 'sms', 'email', 'slack', 'whatsapp', 'alexa','zendesk','pinpoint'];
  enableButton: boolean;
  selectedChannel: string;
  prevPageTitle: string;
  useCaseId: string;
  workerBotId: string;
  conversation: Conversation;
  routeParamSubscription: Subscription;
  useCase: UseCases;
  useCaseName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private conversationService: ConversationService
  ) {
    this.conversation = new Conversation();
  }

  ngOnInit(): void {
    this.routeParamSubscription = this.route.params.subscribe((params: Params) => {
      this.useCaseId = params['useCaseId'];
      // Fetching data for navigation bar
      this.useCaseName = JSON.parse(this.utilService.getSessionStorage('currentUseCase'));
      const workerBot: any = JSON.parse(this.utilService.getSessionStorage('currentWorkerBot'));
      this.prevPageTitle = workerBot.name;
      this.workerBotId = workerBot.id;

      this.getUseCase(this.useCaseId);
    });
  }

  onChangeSelection(form): void {
    this.enableButton = this.selectedChannel ? true : false;
  }

  getUseCase(useCaseId: string): void {
    this.conversationService.getUseCase(useCaseId).subscribe(
      (useCase: UseCases) => {
        this.useCase = useCase;
        //this.useCaseName = this.useCase.useCaseName;
        // Check if usecase has channels
        if (this.useCase.useCaseChannel) {
          // Need to make API call to get  conversation id for which channel need to navigate
        }
      },
      (error: any) => {
        // log error or redirect to dashboard
        this.navigateToWorkerBotConfig();
      }
    );
  }

  /**
   * @internal
   * This function  navigates  to the worker bot configuration page
   *
   */
  navigateToWorkerBotConfig(): void {
    this.router.navigate(['workerbot', this.workerBotId]);
  }

  /**
   * @internal
   * This function  navigates to flow page
   *
   */
  navigateToFlow(conversationFlowId: string): void {
    this.router.navigate(['conversation/view', conversationFlowId]);
  }

  /**
   * @internal
   * This function  navigates to entry point page
   *
   */
  navigateToEntryPoint(conversationFlowId: string): void {
    this.router.navigate(['conversation', conversationFlowId, 'entry']);
  }

  handleSubmit(form): void {
    const payload = {
      channel: form.channel,
      useCaseId: this.useCaseId
    };
    payload.channel = payload.channel === 'sms' ? 'twilioText' : payload.channel;
    payload.channel = payload.channel === 'teams' ? 'msteams' : payload.channel;

    const conversation = this.conversation.mapToPutApi(payload);
    this.conversationService.createConversation(conversation).subscribe(
      (response: Conversation) => {
        this.navigateToFlow(response.conversationFlowId);
      },
      (error: any) => {
        // log error
      }
    );
  }

  ngOnDestroy(): void {
    this.routeParamSubscription.unsubscribe();
  }
}
