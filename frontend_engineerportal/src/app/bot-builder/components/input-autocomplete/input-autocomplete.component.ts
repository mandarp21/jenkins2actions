import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ConversationService } from '../../../bot-builder/services/conversation.service';

@Component({
  selector: 'input-autocomplete',
  styleUrls: ['input-autocomplete.component.sass'],
  templateUrl: 'input-autocomplete.component.html'
})

/**
 * @description Text input component with autocomplete functionality pulling variables from conversationService
 * @param {string} value - input value
 */
export class InputAutocompleteComponent implements OnInit {
  @Input()
  message: string;
  @Input()
  placeholder: string;
  @Output()
  inputChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  id: string;
  @Input()
  type: string;

  variablesOptions: string[];
  visibleVariables: string[];
  visibleVariableDetails: string[];
  apiFullList: any[];
  variableDetails: any[];
  variableTypes: any;

  /**
   * @description The constructor which is setting default values
   */
  constructor(private conversationService: ConversationService) {}

  /**
   * @description Lifecycle hook for first time the nativeElements have initialised
   */
  ngOnInit() {
    this.variableTypes = this.variableTypes || {};
    // get the variables list
    this.conversationService.variablesListObs.subscribe((data: any) => {
      this.variablesOptions = data || [];
    });

    // get variable types
    this.conversationService.variableDetailsObs.subscribe((data: any[]) => {
      this.variableDetails = data;
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          this.variableTypes[data[i].name] = data[i].type;
        }
      }
    });

    this.getVariableList(); // Get a list with all the available APIs and their details
  }

  /**
   * @description get the list of api variables and set them in the conversation service. Will be used by the card editor
   */
  async getVariableList() {
    this.apiFullList = await this.conversationService.listVariables().catch(err => {});
  }

  /**
   * @description Event listener for when input changes
   * @param {string} value - input value
   */
  onInput(data) {
    const pointerIndex = data.search(new RegExp(/\@(?!{)/g));
    if (pointerIndex !== -1) {
      let text = data.split('@')[1];
      text = text.split(' ')[0];
      this.visibleVariables = this.variablesOptions.filter(item => item.indexOf(text) !== -1);
    } else {
      this.visibleVariables = [];
    }
  }

  /**
   * @description Event listener for every time the
   * @param {string} variable - selected variable
   */
  onChange() {
    this.inputChange.emit(this.message);
  }

  /**
   * @description Handles selecting variables from the dropdown
   * @param {string} variable - selected variable
   */
  onVariableSelect(variable) {
    let text = this.message.split('@')[1];
    text = text.split(' ')[0];
    this.visibleVariables = [];
    this.visibleVariableDetails = [];
    // Find and return available variables in the main API
    if (this.variableTypes[variable] === 'API') {
      this.getVariablesOfApi(variable);
      this.message = this.message.replace('@' + text, '${' + variable + '.');
    } else {
      this.message = this.message.replace('@' + text, '${' + variable + '}');
    }

    this.inputChange.emit(this.message);
  }

  /**
   * @description Handles selecting variables from the dropdown
   * @param {string} variable - selected variable
   */
  onVariableSelectSecondOption(variable) {
    this.message = this.message + variable + '}';
    this.visibleVariableDetails = [];
    this.inputChange.emit(this.message);
  }

  /**
   * @description finds the success values of the API variable
   * @param {string} variable - selected variable
   */
  getVariablesOfApi(variable) {
    const fullVar = this.variableDetails.find(item => item.name === variable);
    this.visibleVariableDetails = Object.keys(fullVar['config']['success']);
  }
}
