import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'reference-card',
  styleUrls: ['reference-card.component.sass'],
  templateUrl: 'reference-card.component.html'
})
export class ReferenceCardComponent {
  private type: string;
  @Input()
  refId: string;
  @Input()
  title: string;
  @Input()
  description: string;
  @Output()
  eventClick = new EventEmitter();

  @Input()
  useCaseId: string;
  @Input()
  workerBotId: string;

  @Input()
  nextStep: string;
  @Input()
  nextStepName: string;

  constructor() {
    this.type = 'reference-card';
  }

  handleClick(action) {
    this.eventClick.emit({
      action: action,
      type: this.type
    });
  }
}
