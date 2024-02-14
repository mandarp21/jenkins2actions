import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'diverging-add-card',
  styleUrls: ['diverging-add-card.component.sass'],
  template: `
  <div class="card-container" (click)="handleClick('addCondition')">
    <img src="assets/img/Icon_Plus_WHT.png" class="card-icon">
  </div>
`
})

/**
 * @internal
 * This class is a  component that displays Conversation Manager Coniguration.
 *
 */
export class DivergingAddCardComponent {
  private type: string;
  @Input()
  conditionType: string;
  @Output()
  eventClick = new EventEmitter();

  constructor() {
    this.type = 'diverging-add-card';
  }

  handleClick(action) {
    this.eventClick.emit({
      action: action,
      type: this.type,
      conditionType: this.conditionType
    });
  }
}
