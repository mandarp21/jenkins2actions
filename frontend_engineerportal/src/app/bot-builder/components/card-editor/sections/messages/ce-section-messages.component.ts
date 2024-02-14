import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ce-section-messages',
  styleUrls: ['ce-section-messages.component.sass'],
  templateUrl: 'ce-section-messages.component.html'
})

/**
 *
 */
export class CEMessagesSectionComponent implements OnChanges {
  @Output()
  messagesUpdate = new EventEmitter();
  // form variables
  @Input()
  messages: Array<string>;

  constructor() {}

  ngOnChanges() {
    this.messages = typeof this.messages === 'string' ? JSON.parse(this.messages) : this.messages;
    this.messages = this.messages.length > 0 ? this.messages : [''];
  }

  changeMessages(index, value) {
    this.messagesUpdate.emit({ index, value });
  }
}
