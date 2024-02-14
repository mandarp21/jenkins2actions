import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { BotType } from '../../types/bot-type.type';
import { branchingNodes } from '../../../app-constant';

@Component({
  selector: 'flow-card',
  styleUrls: ['flow-card.component.sass'],
  templateUrl: 'flow-card.component.html'
})

/**
 * @internal
 * This class is a  component that displays Conversation Manager Coniguration.
 *
 */
export class FlowCardComponent implements OnChanges {
  iconUrl: string;
  showTooltips: boolean;
  private type: string;
  @Input()
  description: string;
  @Input()
  title: string;
  @Input()
  user: boolean;
  @Input()
  unconnectedNode: boolean;
  @Input()
  responseType: string;
  @Input()
  messages: any;
  @Input()
  botType: BotType;
  @Output()
  eventClick = new EventEmitter();
  @Input()
  hideActionBar: boolean;
  @Input()
  firstNode: boolean;

  linkActive = false;
  isSplittingNode: boolean;

  constructor() {
    this.unconnectedNode = false; // initalize to false
    this.type = 'flow-card';
    this.messages = this.messages;
    this.botType = this.user === true ? null : this.botType;
  }

  ngOnChanges() {
    this.iconUrl = this.user === true ? 'assets/img/card-editor/User_Icon_Grey.svg' : 'assets/img/card-editor/Bot_Icon_Grey.svg';
    this.botType = this.user === true ? null : this.botType;
    if (branchingNodes[this.responseType]) {
      this.isSplittingNode = true;
    } else {
      this.isSplittingNode = false;
    }
  }

  handleClick(action, overlayModeType?) {
    this.eventClick.emit({
      action: action,
      type: this.type,
      overlayModeType: overlayModeType
    });
  }

  toggleTooltips() {
    this.showTooltips = this.showTooltips ? false : true;
    this.linkActive = false;
  }
}
