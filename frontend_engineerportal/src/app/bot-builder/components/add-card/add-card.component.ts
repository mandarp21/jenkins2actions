import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'add-card',
  styleUrls: ['add-card.component.sass'],
  templateUrl: 'add-card.component.html'
})
export class AddCardComponent implements OnChanges, OnInit {
  private type: string;
  @Input()
  showLink: boolean;
  @Input()
  linkActive: boolean;
  @Output()
  eventClick = new EventEmitter();
  @Input()
  endFlow: boolean;
  @Input()
  parentType: string;
  @Input()
  id: string;
  @Input()
  firstNode: boolean;
  @Output()
  switchEndFlow = new EventEmitter();

  constructor(private conversationService: ConversationService) {
    this.type = 'add-card';
  }

  ngOnInit() {
    this.conversationService.linkActiveObs.subscribe(data => {
      this.linkActive = data === this.id;
    });
  }

  ngOnChanges() {
    this.showLink = this.showLink ? this.showLink : false;
  }

  endFlowChange() {
    this.endFlow = !this.endFlow;
    this.switchEndFlow.emit(this.endFlow);
  }

  handleClick(action, overlayModeType?) {
    if (overlayModeType === 'link') {
      this.conversationService.setLinkActive(this.id);
    }
    this.eventClick.emit({
      action: action,
      type: this.type,
      overlayModeType: overlayModeType
    });
  }
}
