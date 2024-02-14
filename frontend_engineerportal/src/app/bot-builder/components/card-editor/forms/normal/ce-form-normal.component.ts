import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ConversationService } from '../../../../services/conversation.service';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { DropDownOption } from '../../../../../model/dropdown-option.model';
import { ToastrService } from 'ngx-toastr';
import * as helper from '../../../../utilities/helper';
import { CHANNEL_PAYLOAD_OPTIONS } from '../../../../../app-constant';

@Component({
  selector: 'ce-form-normal',
  styleUrls: ['../form-styles.sass'],
  templateUrl: 'ce-form-normal.component.html'
})

/**
 *
 */
export class CENormalFormComponent implements OnInit {
  @Output()
  eventOutput = new EventEmitter();
  activeChannel: string;

  // form variables
  stepDescription: string;
  owner: string;
  type: string;
  messages: Array<string>;
  tempMessages: Array<string>;
  carouselImages: Array<any>;
  feedbackTiles: Array<any>;
  feedbackReqMsg: string;
  intent: string;
  entities: Array<any>;
  stepForm: FormGroup;
  ownerOptions = ['bot', 'user'];
  activeComponent: any;
  variables: string[];
  selectedDateRestriction: string;

  dateRestrictionOptions: DropDownOption[];
  dynamicButtonsIterableProperty: object;
  selectedApi: string;
  apiOptions: DropDownOption[];

  intentOptions: DropDownOption[];
  entityOptions: DropDownOption[];
  variableOptions: DropDownOption[];
  isEdit: boolean;
  ownerErrorMsg: boolean;
  typeErrorMsg: boolean;
  regexVariable: string;
  regexBoolMask: boolean;
  slotFilling: boolean;

  typeOptions: Array<any> = [
    {
      id: 'msg',
      tooltip: 'Message'
    },
    {
      id: 'crsl',
      tooltip: 'Carousel'
    },
    {
      id: 'options',
      tooltip: 'Buttons'
    },
    {
      id: 'variable',
      tooltip: 'Variable Decision'
    },
    {
      id: 'decision',
      tooltip: 'Decision'
    },
    {
      id: 'datepicker',
      tooltip: 'DatePicker'
    },
    {
      id: 'dynamicButtons',
      tooltip: 'Dynamic Buttons'
    }
  ];

  simpleTextChannels = ['voice', 'twilioText', 'email', 'alexa'];

  /**
   * @description handles user-specific value changes
   * @param type value type to change
   * @param data dropdown options selected
   */
  onSelChangeUser(type, data) {
    if (type === 'intent') {
      this.intent = data.key;
      this.stepForm.patchValue({ intent: data.key });
    } else if (type === 'entities') {
      this.entities = data;
      this.stepForm.patchValue({ entities: data });
    }
  }

  /**
   * @description handles change in the api select dropdown
   * @param data dropdown option selected
   */
  onSelectChangeAPI(data) {
    this.selectedApi = data.key;
    this.stepForm.patchValue({ selectedApi: data.key });
  }

  /**
   * @description handles change in the variable select dropdown
   * @param data dropdown option selected
   */
  onVariablesChange(data) {
    this.variables = data;
    this.stepForm.patchValue({ variables: data });
  }

  constructor(
    private conversationService: ConversationService,
    private formBuilder: FormBuilder,
    private workerBotService: WorkerBotService,
    private toastr: ToastrService
  ) {
    this.resetErrorValues();
  }

  /**
   * @description things to do when the component is initialized
   */
  ngOnInit() {
    this.dateRestrictionOptions = new DropDownOption().deserialize([
      helper.DATE_RESTRICTION_OPTIONS_ENUM.NR,
      helper.DATE_RESTRICTION_OPTIONS_ENUM.PDO,
      helper.DATE_RESTRICTION_OPTIONS_ENUM.FDO
    ]);

    // get the Intent list
    this.workerBotService.intentListOptionObs.subscribe((data: DropDownOption[]) => {
      this.intentOptions = data ? data : null;
    });

    // get the Entity list
    this.workerBotService.entityListOptionObs.subscribe((data: DropDownOption[]) => {
      this.entityOptions = data ? data : null;
    });

    this.conversationService.activeChannelObs.subscribe(val => (this.activeChannel = val));

    this.conversationService.activeComponentObs.subscribe(val => this.buildForm(val));

    // get the variable options
    this.conversationService.variablesOptionsObs.subscribe((val: DropDownOption[]) => (this.variableOptions = val ? val : []));

    // get useCase name
    this.conversationService.useCaseDataObs.subscribe(val => {
      const findFeedbackOption = obj => {
        return obj.id === 'feedbackTiles' || obj.id === 'feedbackReqMsg';
      };

      // add feedback options
      if (val.useCaseName && val.useCaseName === 'feedback' && !this.typeOptions.find(findFeedbackOption)) {
        this.typeOptions.push({
          id: 'feedbackTiles',
          tooltip: 'Feedback Tiles'
        });
        this.typeOptions.push({
          id: 'feedbackReqMsg',
          tooltip: 'Feedback Request Message'
        });
      }
    });
  }

  /**
   * @description sets the form values
   * @param data object to get values from
   */
  buildForm(data) {
    if (data) {
      // set data to pre-populated form
      data.messages = data.messages ? data.messages : [];
      this.isEdit = true;
      this.stepDescription = data.description;
      this.owner = data.user ? 'user' : 'bot';
      this.type = data.responseType ? data.responseType : '';
      this.messages = typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages;
      this.tempMessages = this.messages.slice();
      this.variables = data.variables || [];
      this.carouselImages = data.carouselImages;
      this.feedbackTiles = data.feedbackTiles;
      this.feedbackReqMsg = data.feedbackReqMsg;
      this.intent = data.intent ? data.intent : '';
      this.entities = typeof data.entities === 'object' ? JSON.parse(JSON.stringify(data.entities)) : [];
      this.selectedApi = data.selectedApi || '';
      this.dynamicButtonsIterableProperty = data.dynamicButtonsIterableProperty
        ? data.dynamicButtonsIterableProperty
        : { key: '', values: [], staticbuttons: [] };
      this.selectedDateRestriction = data.selectedDateRestriction;
      this.carouselImages =
        typeof data.carouselImages === 'object' && data.carouselImages.length ? data.carouselImages.map(item => item) : [];
      this.regexVariable = data.regexVariable;
      this.regexBoolMask = data.regexBoolMask;
      this.slotFilling = data.slotFilling;
    } else {
      // Initial values when form is blank
      this.stepDescription = this.owner = this.type = this.intent = this.selectedApi = this.regexVariable = '';
      this.selectedDateRestriction = helper.DATE_RESTRICTION_OPTIONS_ENUM.NR;
      this.dynamicButtonsIterableProperty = { key: '', values: [], staticbuttons: [] };
      this.entities = [];
      this.messages = [''];
      this.tempMessages = [''];
      this.carouselImages = [];
      this.feedbackTiles = [];
      this.feedbackReqMsg = '';
      this.variables = [];
      this.isEdit = false;
      this.regexVariable = '';
      this.regexBoolMask = false;
      this.slotFilling = false;
    }
    this.resetErrorValues();

    this.stepForm = this.formBuilder.group({
      stepDescription: [this.stepDescription, Validators.required],
      stepFunction: '',
      owner: [this.owner, Validators.required],
      type: [this.type],
      messages: [],
      intent: [this.intent],
      entities: [this.entities],
      carouselImages: [this.carouselImages],
      feedbackTiles: [this.feedbackTiles],
      feedbackReqMsg: this.feedbackReqMsg,
      variables: [],
      selectedDateRestriction: this.selectedDateRestriction,
      selectedApi: this.selectedApi,
      dynamicButtonsIterableProperty: this.formBuilder.group({
        key: [this.dynamicButtonsIterableProperty['key']],
        values: this.formBuilder.array([]),
        staticbuttons: this.formBuilder.array([])
      }),
      regexVariable: this.regexVariable,
      regexBoolMask: this.regexBoolMask,
      slotFilling: this.slotFilling
    });

    if (this.dynamicButtonsIterableProperty['values'].length > 0) {
      this.dynamicButtonsIterableProperty['values'].map((item: any) => {
        this.addValue(item);
      });
    } else {
      this.addValue('');
    }

    if (this.dynamicButtonsIterableProperty['staticbuttons'].length > 0) {
      this.dynamicButtonsIterableProperty['staticbuttons'].map((item: any) => {
        this.addStaticButton(item);
      });
    }

    this.stepForm.patchValue({ messages: JSON.stringify(this.tempMessages) });
    this.stepForm.patchValue({ variables: this.variables });
    this.onChanges();
  }

  /**
   * @description adds value to dynamic buttons response
   * @param data data of the value to add
   */
  addValue(data) {
    const control = <FormArray>this.stepForm.controls['dynamicButtonsIterableProperty']['controls']['values'];
    const addrCtrl = this.formBuilder.group({
      fieldname: [data ? data['fieldname'] : '']
    });
    control.push(addrCtrl);
  }

  /**
   * @description removes value from dynamic buttons response
   * @param i index of the value to remove
   */
  removeValue(i: number) {
    const control = <FormArray>this.stepForm.controls['dynamicButtonsIterableProperty']['controls']['values'];
    control.removeAt(i);
  }

  /**
   * @description adds static button for dynamic buttons response
   * @param data data of the button to add
   */
  addStaticButton(data) {
    const control = <FormArray>this.stepForm.controls['dynamicButtonsIterableProperty']['controls']['staticbuttons'];
    const addrCtrl = this.formBuilder.group({
      name: [data ? data['name'] : ''],
      value: [data ? data['value'] : '']
    });
    control.push(addrCtrl);
  }

  /**
   * @description removes static button from dynamic buttons response
   * @param i index of the button to remove
   */
  removeStaticButton(i: number) {
    const control = <FormArray>this.stepForm.controls['dynamicButtonsIterableProperty']['controls']['staticbuttons'];
    control.removeAt(i);
  }

  /**
   * @description changes the owner property
   * @param newOwner new owner to change to
   */
  changeOwner(newOwner) {
    if (!this.isEdit && !(this.isFirstCard() && newOwner === 'bot')) {
      this.owner = newOwner;
      this.stepForm.patchValue({ owner: newOwner });
    }
  }

  /**
   * @description checks if option has been disabled
   * @param type the button to check
   */
  isOptionDisabled(type) {

    const validOptions = CHANNEL_PAYLOAD_OPTIONS[this.activeChannel];
    
    if (this.isEdit) {
      return true;
    }
    else if (validOptions.indexOf(type.id) > -1) {
      return false;
    }
    
    else return true;
    
  }

  /**
   * @description changes response type
   * @param newType type selected
   */
  changeType(newType) {
    if (!this.isOptionDisabled(newType)) {
      this.type = newType.id;
      this.stepForm.patchValue({ type: newType.id });
    }
  }

  /**
   * @description checks if tthis is the first card to be created
   */
  isFirstCard() {
    return this.conversationService.isFirstNode();
  }

  /**
   * @description updates message values
   * @param data form data submitted
   */
  messagesUpdate(data) {
    this.tempMessages[data.index] = data.value;
    this.stepForm.patchValue({ messages: JSON.stringify(this.tempMessages.filter(message => message !== '')) });
  }

  /**
   * @description updates carousel values
   * @param data form data submitted
   */
  filesListUpdate(data) {
    this.stepForm.patchValue({ carouselImages: data });
  }

  /**
   * @description event handler for radio button changes
   */
  onChanges() {
    this.stepForm.valueChanges.subscribe(() => {
      this.owner = this.stepForm.value.owner;
      this.type = this.stepForm.value.type;
    });
  }

  /**
   * @description updates feedback tile value
   * @param data form data submitted
   */
  feedbackTilesUpdate(data) {
    this.feedbackTiles[data.index] = data.tile;
    this.stepForm.patchValue({ feedbackTiles: this.feedbackTiles });
  }

  /**
   * @description updates feedback request message value
   * @param data form data submitted
   */
  feedbackMessageUpdate(message) {
    this.stepForm.patchValue({ feedbackReqMsg: message });
  }

  /**
   * @description Save chosen value to the form on change as well as changing the actual value
   * @param data
   */
  onSelectChangeRestriction(data) {
    this.stepForm.patchValue({ selectedDateRestriction: data.key });
    this.selectedDateRestriction = data.key;
  }

  /**
   * @description handles save button click
   * @param form form data submitted
   */
  handleSave(form) {
    if (this.owner === 'bot' && !this.type) {
      this.typeErrorMsg = true;
    } else if (this.owner === '') {
      this.ownerErrorMsg = true;
    } else {
      // Remove null entity values (e.g. when 'Select Entity' is chosen)
      this.entities = this.entities.filter(entity => {
        return entity && typeof entity === 'object';
      });
      form.entities = this.entities;
      this.eventOutput.emit({
        action: 'save',
        form: form
      });
    }
  }

  /**
   * @description handles cancel button click
   */
  handleCancel() {
    this.eventOutput.emit({
      action: 'closeSideBar'
    });
  }

  /**
   * @description reset error values
   */
  resetErrorValues(): void {
    this.ownerErrorMsg = false;
    this.typeErrorMsg = false;
  }

  /**
   * @description Whenever the value is changed for selected variable for PII Mask Var - Enbridge Custom
   * @param {Object} data
   */
  onRegexSelectChange(data): void {
    this.stepForm.patchValue({ regexVariable: data.key });
    this.regexVariable = data.key;
  }

  /**
   * @description Whenever the toggle is changed for mask value
   * @param {Boolean} - true or false
   */
  onRegexMaskValueToggle(checked: boolean): void {
    this.regexBoolMask = checked;
    this.stepForm.patchValue({ regexBoolMask: checked });
  }
}
