import { Component, Input, Output, EventEmitter, OnInit, ElementRef, AfterViewChecked } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ConversationService } from '../../services/conversation.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'test-chat',
  templateUrl: 'test-chat.component.html',
  styleUrls: ['test-chat.component.sass']
})
export class TestChatComponent implements OnInit, AfterViewChecked {

  @Input()
  showChatModal: boolean;


  @Output()
  eventClick = new EventEmitter();
  userInputMessage: string;
  testChatInputText: string;
  workerBotId: string;
  masterBotId: string;
  masterBotName: string;
  params: object;
  sessionId: string;
  socketId: string;
  chatConversation: any;
  typingBubble: boolean;
  conversationData: object;
  lastChannel: string = 'none';


  constructor(
    private conversationService: ConversationService,
    private utilService: UtilService,
    private chatService: ChatService,
    private scrollElement: ElementRef
  ) { }

  async initializeChat() {
    const self = this;

    this.testChatInputText = '';

    await this.chatService.initSocket();
    
    this.conversationService.getConversationData().subscribe(val => {
      self.conversationData = val;

      // send welcome message when channel is changed
      if(val && val['channel'] && val['channel'] !== self.lastChannel){
        self.lastChannel = val['channel'];
        // reset chat when channel is changed
        self.chatConversation = {
          content: []
        };
        self.params = {
          input: 'welcome',
          masterBotId: self.masterBotId,
          socketId: self.socketId,
          channel: self.lastChannel
        };
        // Send initial message to server to get welcome message
        self.sendMessageToServer(JSON.stringify(self.params));
      }
    });

    // Listen to incoming messages back from server
    this.chatService.socket.on('webOut', function(message) {
      // Stop showing typing bubble once we get response from server
      self.typingBubble = false;
      // Display message on chat
      self.displayMessageOnChat(true, message.converseResponse);
    });

    // Assign sessionId from cookie
    this.chatService.socket.on('updateSessionCookie', sessionDetails => {
      try {
        this.sessionId = sessionDetails.sessionId;
        this.socketId = sessionDetails.socketId;
      } catch (err) {
        console.log(err);
      }
    });


  }

  ngOnInit() {
    const self = this; // Reassign this to self to not intervene with 'this' socket connection
    this.chatConversation = {
      content: []
    };
    this.testChatInputText = '';

    this.conversationService.workerBotIdObs.subscribe(val => (this.workerBotId = val));
    const masterBotData = JSON.parse(this.utilService.getSessionStorage('currentMasterBot'));
    this.masterBotId = masterBotData.id;
    this.masterBotName = masterBotData.name;
    this.initializeChat();
  }

  closeOverlay() {
    this.showChatModal = false;
    this.eventClick.emit();
  }

  sendChatButtonClick(value) {
    this.testChatInputText = value;
    if (this.testChatInputText) {
      this.converse();
    }
  }

  keyUp(value, keyCode) {
    this.testChatInputText = value;
    if (keyCode === 13 && this.testChatInputText) {
      this.converse();
    }
  }

  ngAfterViewChecked() {
    try {
      const elementToScroll = this.scrollElement.nativeElement.firstChild.firstChild.children[1];
      elementToScroll.scrollTop = elementToScroll.scrollHeight;
    } catch (err) {
      console.log('Error in scrolling');
    }
  }

  private converse() {
    this.params = {
      input: this.testChatInputText,
      masterBotId: this.masterBotId,
      sessionId: this.sessionId,
      channel: this.conversationData['channel']
    };

    // Display temporary bubble after user sends a message to mock agent typing
    this.typingBubble = true;

    // Display message on chat
    this.displayMessageOnChat(false, [this.testChatInputText]);

    // Clear input field after sending to server
    this.testChatInputText = '';

    // Send message to server
    this.sendMessageToServer(JSON.stringify(this.params));

    // hide after 7s
    setTimeout(() => {
      this.typingBubble = false;
    }, 7000);
  }

  /**
   * @description - receives a message for the server and decide what type it is
   * @param isAgentMsg
   * @param content
   */
  private displayMessageOnChat(isAgentMsg, content) {
    let text = content;
    let button = null;
    let carousel = null;
    let datepicker = null;

    // If its a message from the server then format its components
    if (isAgentMsg) {
      text = content.response !== null ? content.response : '';
      button = content.responseConfig && content.responseConfig.buttons ? content.responseConfig.buttons : [];
      carousel = content.responseConfig && content.responseConfig.carousel !== null ? content.responseConfig.carousel : null;
      // If smileys(feedback) exist then format to carousel object
      if (!carousel && content.responseConfig && content.responseConfig.card && content.responseConfig.card.smileys) {
        let smileys = content.responseConfig.card.smileys;
        carousel = [];
        for (var key in smileys) {
          if (smileys.hasOwnProperty(key) && key != 'height' && key != 'width') {
            carousel.push({
              title: key,
              url: smileys[key]
            });
          }
        }
      }
      if (!carousel && content.responseConfig && content.responseConfig.feedbackTiles) {
        carousel = [];
        let feedbackTiles = content.responseConfig.feedbackTiles;
        feedbackTiles.forEach((tile) => {
          carousel.push({
            title: tile.name,
            url: tile.image
          });
        });
      }
      if (content.responseConfig && content.responseConfig.feedbackReqMsg) {
        text = [content.responseConfig.feedbackReqMsg];
      }
      datepicker = content.responseConfig && content.responseConfig.datepicker ? content.responseConfig.datepicker : null;
    }

    this.chatConversation.content.push({
      messages: text,
      agent: isAgentMsg,
      timestamp: new Date().toISOString(),
      buttons: button,
      carousel: carousel,
      datepicker: datepicker
    });
  }

  /**
   * @description sends message over websocket to the server
   * @param message - the message to send to the server
   */
  private sendMessageToServer(message) {
    this.chatService.socket.emit('webIn', {
      message: message
    });
  }
}
