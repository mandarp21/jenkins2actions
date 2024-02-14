import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { Conversation } from '../../model/conversation.model';
import { UseCases } from '../../../model/use-cases';
import { ToastrService } from 'ngx-toastr';
import { CHANNEL_PAYLOAD_OPTIONS } from '../../../app-constant';

@Component({
  selector: 'channels',
  styleUrls: ['channels.component.sass'],
  templateUrl: 'channels.component.html'
})

/**
 * @internal
 * This class is a  component that displays the Channels component.
 */
export class ChannelsComponent implements OnInit {
  @Output()
  eventClick = new EventEmitter();

  selectedAction: string = null;
  overlay = false;
  useCaseData: UseCases;
  conversation: Conversation;
  availableChannels;
  channelsAvailable: Array<string>;
  currentConversation;
  currentConversationId;
  conversationFlowData = [];
  conversationFlows;
  currentChannelName: string;
  simpleTextChannels = ['voice', 'sms', 'email', 'slack', 'whatsapp', 'alexa'];
  copyChannelError: boolean;
  addChannelError: boolean;

  constructor(private conversationService: ConversationService, private toastr: ToastrService) {
    this.resetErrors();
  }

  /**
   * @description overlay click handler
   */
  closeOverlay() {
    this.overlay = false;
    this.selectedAction = 'hide';
  }

  /**
   * @description channels options button click handler
   * @param action action of the button clicked
   */
  handleClick(action) {
    if (this.selectedAction === action) {
      this.selectedAction = null;
      this.overlay = false;
    } else {
      this.selectedAction = action;
      this.overlay = true;
    }
    this.resetErrors();
  }

  /**
   * @description sets up data variables from conversationService
   */
  async ngOnInit() {
    this.conversationService.useCaseDataObs.subscribe(val => {
      this.useCaseData = val;
    });

    this.conversationService.conversationFlowsObs.subscribe(val => {
      this.conversationFlows = val;
      this.channelsAvailable = this.conversationFlows.map(item => {
        return {
          colName: item.channel.toLowerCase().replace(/^\w/, c => c.toUpperCase()),
          key: item.channel
        };
      });
    });

    this.conversationService.getConversationData().subscribe(val => {
      this.currentConversation = val;
      this.currentConversationId = val['conversationFlowId'];
    });

    this.availableChannels = await this.conversationService
      .getUseCase(this.useCaseData.useCaseId)
      .toPromise()
      .catch(err => {});

    this.channelsAvailable = this.availableChannels.useCaseChannel.map(item => {
      return {
        colName: item.toLowerCase().replace(/^\w/, c => c.toUpperCase()),
        key: item
      };
    });
    this.currentChannelName = this.currentConversation.channel;
  }

  /**
   * @description Copy data of one channel to another
   * @param from channel to copy from
   * @param to channel to copy to
   */
  async copyConversationFlow(from, to) {
    // rename 'sms' to 'twilioText' so that it works with backend
    to = to === 'sms' ? 'twilioText' : to;
    from = from === 'sms' ? 'twilioText' : from;

    const fromConvId = this.conversationFlows.find(item => item.channel === from).conversationFlowId;
    const toConvId = this.conversationFlows.find(item => item.channel === to).conversationFlowId;

    // get conversation data for both channels
    const fromConversation = await this.conversationService
      .getConversation(fromConvId)
      .toPromise()
      .catch(err => {});

    const toConversation = await this.conversationService
      .getConversation(toConvId)
      .toPromise()
      .catch(err => {});

    // copy flow value to the selected conversation and save it
    toConversation['flow'] = fromConversation['flow'] || [];
    await this.conversationService.saveConversation(toConversation);
    // Refresh conversatinon data only if 'copy from' is selected
    if (this.currentConversationId !== fromConvId) {
      this.conversationService.copyChannels(true);
    }
  }

  /**
   * @description checks if copy action is possible for the selected channels
   * @param fromChannel channel to copy from
   * @param toChannel channel to copy to
   */
  async isCopyPossible(fromChannel, toChannel) {
    if (fromChannel && toChannel) {
      const fromConvId = this.conversationFlows.find(item => item.channel === fromChannel).conversationFlowId;
      const fromConversation = await this.conversationService
        .getConversation(fromConvId)
        .toPromise()
        .catch(err => {});

      const validOptions =   CHANNEL_PAYLOAD_OPTIONS[toChannel];
     
      // it should not be possible for a voice channel to have carousel or options type steps
      const invalidNodes = fromConversation['flow'].filter(item => {
        if (validOptions.indexOf(item.responseType)==-1 && item.responseType!==undefined)
            return item;
      });
      
      if ( invalidNodes.length > 0) {
        const channelName = toChannel.charAt(0).toUpperCase() + toChannel.substr(1);
        this.toastr.error(channelName + ' channel can contain only '+validOptions, 'Error saving channel');

        return false;
      }
       else return true;
    } 
    else {
      this.copyChannelError = true;
      return false;
    }
  }

  /**
   * @description handles the case when 'copy entire flow' option is selected
   * @param data form data submitted
   */
  async handleCopySelection(data) {
    let fromChannel;
    let toChannel;

    // if 'add channel' form has been submitted
    if (data.formType === 'add') {
      fromChannel = data.source;
      toChannel = data.channelType;

      // if 'copy from' option was selected
    } else if (data.isCopyFrom) {
      fromChannel = data.source;
      toChannel = this.currentConversation.channel;

      // if 'copy to' option was selected
    } else {
      toChannel = data.source === 'new-channel' ? data.channelType : data.source;
      fromChannel = this.currentConversation.channel;
    }
    // copy flow and close window if content source was selected
    if (fromChannel && toChannel) this.closeOverlay();
    if (await this.isCopyPossible(fromChannel, toChannel)) {
      this.copyConversationFlow(fromChannel, toChannel);
    }
  }

  /**
   * @description creates new conversation flow
   * @param data form data submitted
   */
  async createConversation(data) {
    // initialise new conversation data
    const payload = {
      channel: data.channelType === 'sms' ? 'twilioText' : data.channelType,
      useCaseId: this.useCaseData.useCaseId
    };
    this.conversation = new Conversation();
    const conversation = this.conversation.mapToPutApi(payload);

    // call backend service to save conversation
    this.conversationService.createConversation(conversation).subscribe(
      async (response: Conversation) => {
        // reloads the conversation flows list after the new one has been created
        this.conversationFlows = await this.conversationService
          .listConversationFlows(this.useCaseData.useCaseId, true)
          .toPromise()
          .catch(err => {});

        // if a flow should be copied to the new conversation, do that. Else just show success message
        if (data.contentOp === 'copy-flow' || this.selectedAction === 'channels-copy') {
          this.handleCopySelection(data);
        } else {
          this.toastr.success('Conversation added successfully');
          this.conversationService.setActiveChannel(data.channelType);
        }
      },
      (error: any) => {
        this.toastr.error(error.error.error, 'Error saving channel');
      }
    );
  }

  /**
   * @description handles channel editor button click
   * @param data form data submitted
   */
  async handleEditorButton(data) {
    // if window should be closed
    let channelName = '';
    if(data.channelType ){
      channelName = data.channelType.charAt(0).toUpperCase()+ data.channelType.substr(1);
    }

    if (data === 'close') {
      this.closeOverlay();

      // if channel type is not selected
    } else if (!data.channelType && (this.selectedAction === 'channels-new' || (data.source && data.source.key === 'new-channel'))) {
      this.addChannelError = true;

      // if only copy action should be done
    } else if (this.selectedAction === 'channels-copy' && data.source !== 'new-channel') {
      this.handleCopySelection(data);

      // if copy is not possible
    } else if (this.selectedAction === 'channels-new' && data.contentOp === 'copy-flow' && data.source !== 'new-channel') {
      this.createConversation(data);

      // if copy is not possible
    } else if (
      (this.selectedAction === 'channels-new' &&
        data.contentOp === 'copy-flow' &&

        !this.isCopyPossible(this.currentChannelName, channelName)) ||

      (this.selectedAction === 'channels-copy' &&
        data.contentOp === 'copy-flow' &&
        !data.isCopyFrom &&

        !this.isCopyPossible(this.currentChannelName, channelName))

    ) {

      this.toastr.error(channelName + ' channels cannot contain present in '+this.currentChannelName, 'Error saving channel');

      // if should create new conversation first
    } else {
      if (data.contentOp === 'create-empty' || data.source) {
        this.closeOverlay();
      }
      this.createConversation(data);
    }
  }

  //Reset error values
  resetErrors(): void {
    this.copyChannelError = false;
    this.addChannelError = false;
  }
}
