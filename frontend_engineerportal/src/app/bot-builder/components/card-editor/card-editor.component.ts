import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'card-editor',
  styleUrls: ['card-editor.component.sass'],
  templateUrl: 'card-editor.component.html'
})

/**
 * @internal
 * This class is a  component that displays Conversation Manager Coniguration.
 *
 */
export class CardEditorComponent {
  @Input()
  show: boolean;
  @Input()
  formType: string;
  @Input()
  resetVariables: boolean;
  @Output()
  eventClick = new EventEmitter();
  stepFunction: string;
  apiParametersObj: Array<string>;
  formError: boolean;
  // form variable declarations
  conditionDescription: string;
  header: string;

  variableTypes = [
    {
      colName: 'String',
      key: 'String'
    },
    {
      colName: 'Number',
      key: 'Number'
    },
    {
      colName: 'Boolean',
      key: 'Boolean'
    }
  ];

  constructor() {
    this.header = 'New Step';
  }

  handleEvent(data) {
    data.form ? this.eventClick.emit({ action: data.action, form: data.form }) : this.eventClick.emit({ action: data.action });
  }
}
