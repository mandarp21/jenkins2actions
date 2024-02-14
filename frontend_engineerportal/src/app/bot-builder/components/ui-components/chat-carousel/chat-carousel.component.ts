import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-carousel',
  templateUrl: 'chat-carousel.component.html',
  styleUrls: ['chat-carousel.component.sass']
})
export class ChatCarouselComponent {
  @Input()
  carousel: any;
  @Output()
  eventClick = new EventEmitter();

  constructor() {}

  carouselSend(text) {
    this.eventClick.emit(text);
  }
}
