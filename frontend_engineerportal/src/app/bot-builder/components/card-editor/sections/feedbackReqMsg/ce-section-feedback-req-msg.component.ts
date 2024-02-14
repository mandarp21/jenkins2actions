import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnChanges } from '@angular/core';

@Component({
  selector: 'ce-section-feedback-req-msg',
  styleUrls: ['ce-section-feedback-req-msg.component.sass'],
  templateUrl: 'ce-section-feedback-req-msg.component.html'
})

/**
*
*/
export class CEFeedbackReqMsgSectionComponent implements OnChanges {
  @Output()
  feedbackMessageUpdate = new EventEmitter();
  @Input()
  message: string;

  constructor() {}
  botIconErrorHandler() {}

  ngOnChanges() {
    if(!this.message){
      this.message = "";
    }
  }

  messageChange() {
    this.feedbackMessageUpdate.emit(this.message);
  }
}
