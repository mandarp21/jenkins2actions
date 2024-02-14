import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-quick-res-btns',
  templateUrl: 'chat-quick-res-btns.component.html',
  styleUrls: ['chat-quick-res-btns.component.sass']
})
export class ChatQuickResBtnsComponent {
  @Input()
  buttons: any;
  @Output()
  eventClick = new EventEmitter();

  constructor() {}

  quickResponse(text) {
    this.eventClick.emit(text);
  }
}
