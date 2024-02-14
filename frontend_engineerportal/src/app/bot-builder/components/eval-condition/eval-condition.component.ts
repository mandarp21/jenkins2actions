import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'eval-condition-card',
  styleUrls: ['eval-condition.component.sass'],
  templateUrl: 'eval-condition.component.html'
})
export class EvalConditionComponent {
  private type: string;
  @Input()
  title: string;
  @Input()
  conditionType: string;
  @Input()
  intent: string;
  @Input()
  entities: any;
  @Output()
  eventClick = new EventEmitter();
  showTooltips: boolean;

  constructor() {
    this.type = 'eval-condition-card';
  }

  handleClick(action) {
    this.eventClick.emit({
      action: action,
      type: this.type
    });
  }

  toggleTooltips() {
    this.showTooltips = this.showTooltips ? false : true;
  }
}
