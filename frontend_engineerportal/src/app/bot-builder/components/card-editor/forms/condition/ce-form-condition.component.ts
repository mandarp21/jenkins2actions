import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ConversationService } from '../../../../services/conversation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from '../../../../../services/util.service';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { DropDownOption } from '../../../../../model/dropdown-option.model';
@Component({
  selector: 'ce-form-condition',
  styleUrls: ['../form-styles.sass'],
  templateUrl: 'ce-form-condition.component.html'
})

/**
 *
 */
export class CEConditionFormComponent implements OnInit {
  @Output()
  eventOutput = new EventEmitter();
  // form variables
  conditionDescription: string;
  // TO DO: Change entities to be an array
  intent: string;
  entities: Array<string>;
  conditionType: string;
  conditionStatement: string;
  conditionForm: FormGroup;
  ownerOptions = ['bot', 'user'];
  intentOptions: DropDownOption[];

  entityOptions: DropDownOption[];

  constructor(
    private conversationService: ConversationService,
    private formBuilder: FormBuilder,
    private workerBotService: WorkerBotService
  ) {}

  ngOnInit() {
    this.conversationService.activeComponentObs.subscribe(val => {
      this.buildForm(val);
    });
    // get the Intent list
    this.workerBotService.intentListOptionObs.subscribe((data: DropDownOption[]) => {
      this.intentOptions = data ? data : null;
    });
    // get the Entity list
    this.workerBotService.entityListOptionObs.subscribe((data: DropDownOption[]) => {
      this.entityOptions = data ? data : null;
    });
  }

  onSelChangeUser(type, data) {
    if (type === 'intent') {
      this.intent = data.key;
      this.conditionForm.patchValue({ intent: data.key });
    } else if (type === 'entities') {
      this.entities = data;
      this.conditionForm.patchValue({ entities: data });
    }
  }

  buildForm(data) {
    if (data) {
      this.conditionDescription = data.title;
      this.conditionType = data.conditionType;
      this.intent = data.intent;
      this.entities = data.entities;
      this.conditionStatement = data.conditionStatement;
    } else {
      // otherwise set to empty string
      this.conditionDescription = this.intent = this.conditionStatement = '';
      this.entities = [];
    }

    this.conditionForm = this.formBuilder.group({
      conditionDescription: [this.conditionDescription, Validators.required],
      conditionStatement: [this.conditionStatement, Validators.required],
      intent: [this.intent],
      entities: [this.entities]
    });
  }

  changeConditionStatement(data) {
    this.conditionStatement = data;
    this.conditionForm.patchValue({ conditionStatement: data });
  }
  changeConditionDescription(data) {
    this.conditionDescription = data;
    this.conditionForm.patchValue({ conditionDescription: data });
}
  handleSave(form) {
    this.eventOutput.emit({
      action: 'saveCondition',
      form: form
    });
  }

  handleCancel() {
    this.eventOutput.emit({
      action: 'closeSideBar'
    });
  }
}
