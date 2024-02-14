import { Component, Input, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { BotType } from '../../types/bot-type.type';

@Component({
  selector: 'node',
  styleUrls: ['node.component.sass'],
  templateUrl: 'node.component.html'
})
export class NodeComponent {
  nativeElement: any;
  componentRef: any; // only g iven for dynamic elems

  // Required Fields
  @Input()
  type: string;
  @Input()
  id: string;
  // specific to flow card
  @Input()
  user: boolean; // bot or user
  @Input()
  description: string;
  @Input()
  title: string;
  @Input()
  unconnectedNode: boolean;
  @Input()
  responseType: string;
  @Input()
  messages: any;
  @Input()
  conditionType: string;
  @Input()
  intent: string;
  @Input()
  entities: Array<string>;
  @Input()
  botType: BotType;
  @Input()
  carouselImages: Array<any>;
  @Input()
  showLink: Boolean;
  @Input()
  variables: string[];
  @Input()
  feedbackTiles: Array<any>;
  @Input()
  feedbackReqMsg: string;
  @Input()
  selectedDateRestriction: string;
  @Input()
  conditionStatement: string;
  // specific to eval condition card
  @Input()
  condition: string;
  // specific to dynamic buttons
  @Input()
  dynamicButtonsIterableProperty: string;
  // specific to reference card
  @Input()
  refId: string;

  @Input()
  endFlow: boolean;
  @Input()
  parentType: string;

  @Input()
  linkActive: boolean;
  @Input()
  useCaseId: string;
  @Input()
  workerBotId: string;

  @Input()
  firstNode: boolean;
  @Input() regexVariable: string;
  @Input() regexBoolMask: boolean;

  @Input()
  selectedApi: string;

  @Input()
  slotFilling: boolean;

  @Input()
  nextStep;
  @Input()
  nextStepName;

  @Output()
  eventClick = new EventEmitter();
  @Output()
  switchEndFlow = new EventEmitter();

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  handleEventClicked(data) {
    data.id = this.id;
    this.eventClick.emit(data);
  }

  handleEndFlowSwitch(data) {
    this.switchEndFlow.emit({ id: this.id, value: data });
  }
}
