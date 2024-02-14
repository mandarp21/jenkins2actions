import { Component, Output, EventEmitter, OnInit, OnChanges, Input } from '@angular/core';
import { DropDownOption } from '../../../../../model/dropdown-option.model';
import { Variable } from '../../../../model/variable.model';
import { ConversationService } from '../../../../services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'ce-form-variable',
  styleUrls: ['../form-styles.sass'],
  templateUrl: 'ce-form-variable.component.html'
})

/**
 *
 */
export class CEVariableFormComponent implements OnInit {
  @Input()
  resetVariables: boolean;
  @Output()
  eventOutput = new EventEmitter();
  formError: boolean;
  variables: Array<any>;
  methodOptions: DropDownOption[] = new DropDownOption().deserialize(['GET', 'POST', 'PUT', 'DELETE']);
  staticValueTypes = [
    {
      key: 'String',
      colName: 'String'
    },
    {
      key: 'Number',
      colName: 'Number'
    },
    {
      key: 'RegEx',
      colName: 'RegEx'
    }
  ];

  // form variables

  varTitle: string;
  varPath: string;
  varData: Array<any>;
  // Variable class object
  variable: Variable;

  masterBotId: string;
  name: string;
  type: string;
  id: string;
  description: string;
  config: any = {};
  variableNameError: boolean;
  variableTypeError: boolean;
  valueError: boolean;
  apiUriError: boolean;
  headersError: boolean;
  parametersError: boolean;
  bodyError: boolean;
  variableNameErrorMessage: string;
  header_invalidJSONValuesErrorMessage: string;
  parameters_invalidJSONValuesErrorMessage: string;
  body_invalidJSONValuesErrorMessage: string;
  ceFormVariableTypeError: boolean;
  ceFormSuccessError: boolean;
  ceFormMethodError: boolean;
  ceFormValueType: boolean;
  selectedType;
  boolCaseSensitive: boolean;
  isFormSubmitted: boolean;
  variableTypes: any[] = [
    {
      key: 'API',
      colName: 'API'
    },
    {
      key: 'StaticValue',
      colName: 'Static Value'
    },
    {
      key: 'ContextObject',
      colName: 'Context Object'
    },
    {
      key: 'SoapAPI',
      colName: 'Soap API'
    }
  ];

  constructor(private conversationService: ConversationService, private toastr: ToastrService, private utilService: UtilService) {
    this.variable = new Variable();
    this.varTitle = '';
    this.varPath = '';
    this.varData = [];
    this.boolCaseSensitive = true;
    this.isFormSubmitted = false;
    this.resetErrorValues();
  }

  apiClass(){
    if(!this.selectedType || (this.selectedType.key !== 'API' && this.selectedType.key !== 'SoapAPI')){
      return true;
    }
    else{
      return false;
    } 
  }

  ngOnInit() {
    this.isFormSubmitted = false;
    // To get Variable data
    this.conversationService.variableObs.subscribe(data => {
      this.variable = data;
      if (this.resetVariables === true) {
        this.varData = [];
      }
      this.buildForm();
    });
  }

  /**
   * @description When user moves away from variable title or variable path name, update the value
   */
  onChange(data, name) {
    if (name === 'varTitle') {
      this.varTitle = data.target.value;
    } else {
      this.varPath = data.target.value;
    }
  }

  /**
   * @description To create reactive form group for VariableAPI and fill form data if available
   */
  buildForm() {
    this.masterBotId = JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
    this.name = this.variable && this.variable.name ? this.variable.name : '';
    this.type = this.variable && this.variable.type ? this.variable.type : null;
    this.id = this.variable && this.variable.id ? this.variable.id : null;
    this.selectedType = this.variableTypes.find(item => item.key === this.type);
    this.description = this.variable && this.variable.description ? this.variable.description : '';
    this.config = this.variable && this.variable.config ? JSON.parse(this.variable.config) : {};
    this.boolCaseSensitive = this.config && this.config.boolCaseSensitive ? true : false;

    // stringify the JSON fields if they have any properties
    this.config.headers = this.config.headers ? JSON.stringify(this.config.headers) : undefined;
    this.config.parameters = this.config.parameters ? JSON.stringify(this.config.parameters) : undefined;
    if(this.selectedType === "API"){
      this.config.body = this.config.body ? JSON.stringify(this.config.body) : undefined;
    }
    else{
      this.config.body = this.config.body ? this.config.body : undefined;
    }
    this.config.resetApiCall = this.config.resetApiCall ? this.config.resetApiCall : false;

    const success = this.config.success ? this.config.success : undefined;
    if (success) {
      const successData = Object.keys(success).map(function(key) {
        return { title: key, path: success[key] };
      });
      this.updateSuccessValues(successData);
    }
    this.resetErrorValues();
    this.isFormSubmitted = false;
  }

  /**
   * @description handles dropdown value changes
   * @param data selected dropdown value
   * @param field config value to change
   */
  selChangeConfig(data, field) {
    this.config[field] = data.key;
  }

  /**
   * @description handles Variable Type dropdown change
   * @param data selected dropdown value
   */
  changeType(data) {
    this.selectedType = data;
    this.type = data.key;

    // reset config when the type is changed
    this.config = {};
  }

  /**
   * @description Update the API variables by performing a get request after succesfully addeding a new api
   * This will force an update accross all components subscibed to the api variables in conversation service
   */
  async updateVariables() {
    const listVariables = await this.conversationService.listVariables().catch(err => {});
    listVariables ? this.conversationService.setVariablesOptions(listVariables) : console.log('List APIs was not set');
  }

  /**
   * @description handles input-autocomplete value changes
   * @param data input value
   * @param field config value to change
   */
  changeInput(data, field) {
    this.config[field] = data !== '' ? data : undefined;
  }

  /**
   * @description Function called when user adds the required variable fields
   */
  addVar() {
    if (this.varTitle && this.varPath) {
      this.varData.push({ title: this.varTitle, path: this.varPath });
      this.varTitle = '';
      this.varPath = '';
      this.config.success = this.varData;
    }
  }

  /**
   * @description Function called when user deletes one of the variables added
   */
  removeVar(data) {
    this.varData.splice(this.varData.indexOf(data), 1);
    this.config.success = this.varData;
  }

  /**
   * @description To add/update Variable API
   * @param form - form data required to create Variable API
   */
  async handleSave() {
    this.isFormSubmitted = true;
    this.resetErrorValues();
    // setting fake timeout so that all the values are set before validation
    setTimeout(() => {
      const form = {
        name: this.name,
        description: this.description,
        masterBotId: this.masterBotId,
        id: this.id
      };

      if (this.type) form['type'] = this.type;
      if (this.type) form['config'] = this.filterConfig(this.config);

      let hasErrors = false;
      const validationResults = this.validateForm(form);
      // console.log(validationResults);
      if (validationResults.empty.length) {
        validationResults.empty.forEach(data => {
          if (data === 'Variable Name') {
            this.variableNameError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'Variable Type') {
            this.ceFormVariableTypeError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'Value') {
            this.valueError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'Value Type') {
            this.ceFormValueType = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'API URI') {
            this.apiUriError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'Success') {
            this.ceFormSuccessError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
          if (data === 'Method') {
            this.ceFormMethodError = true;
            this.formError = true;
            this.isFormSubmitted = false;
          }
        });
        hasErrors = true;
      }

      if (validationResults.invalid.length) {
        const errorMessage = 'Please enter valid JSON values';
        validationResults.invalid.forEach(data => {
          if (data === 'Headers') {
            this.headersError = true;
            this.formError = true;
            this.header_invalidJSONValuesErrorMessage = errorMessage;
            this.isFormSubmitted = false;
          }
          if (data === 'Parameters') {
            this.parametersError = true;
            this.formError = true;
            this.parameters_invalidJSONValuesErrorMessage = errorMessage;
            this.isFormSubmitted = false;
          }
          if (data === 'Body') {
            this.bodyError = true;
            this.formError = true;
            this.body_invalidJSONValuesErrorMessage = errorMessage;
            this.isFormSubmitted = false;
          }
        });
        hasErrors = true;
      }

      if (form.name.includes('.') || form.name.includes(' ')) {
        this.variableNameError = true;
        this.formError = true;
        this.variableNameErrorMessage = 'Please do not use dots or spaces in API name';
        hasErrors = true;
        this.isFormSubmitted = false;
      }

      if (!hasErrors) {
        const payloadToSend = new Variable().mapToPostApi(Object.assign({}, this.variable, form));
        if (this.variable && this.variable.id) {
          this.conversationService
            .updateVariable(payloadToSend)
            .then(() => {
              this.toastr.success(`Variable was updated successfully`, 'Save Successful');
              this.isFormSubmitted = false;
              this.updateVariables();
              this.handleCancel('updated');
            })
            .catch(err => {
              if (!err.error.message) {
                this.toastr.error('Please check the logs', 'Something went wrong');
              } else {
                this.toastr.error(err.error.message.replace('Bad Request.', ''), 'Failed');
              }
              console.log(err);
              this.isFormSubmitted = false;
            });
        } else {
          this.conversationService
            .createVariable(payloadToSend)
            .then(() => {
              this.toastr.success(`Variable was saved successfully`, 'Save Successful');
              this.updateVariables();
              this.handleCancel('saved');
            })
            .catch(err => {
              if (!err.error.message) {
                this.toastr.error('Please check the logs', 'Something went wrong');
              } else {
                this.toastr.error(err.error.message.replace('Bad Request.', ''), 'Failed');
              }
              console.log(err);
              this.isFormSubmitted = false;
            });
        }
      }
    }, 0);
  }

  /**
   * @description function to move user variables from array to object (as expected in the backend)
   * @param form - form data required to create Variable
   */
  formatVariables(form) {
    const varObject = {};
    for (let i = 0; i < this.varData.length; i++) {
      varObject[this.varData[i].title] = this.varData[i].path;
    }
    form.success = varObject;
    return form;
  }

  /**
   * @description function to remove the variable added by the user
   */
  handleCancel(action?: any) {
    // reset variables data
    this.varData = [];
    // emitting type of action done VariableAPI saved/updated
    this.eventOutput.emit({
      action: 'closeSideBar',
      actionDone: action
    });
  }

  /**
   * @description removes unnecessary values from variable config
   * @param config the config to be filtered
   */
  filterConfig(config) {
    if (this.type === 'API') {
      return {
        apiUri: config.apiUri,
        method: config.method,
        headers: config.headers,
        parameters: config.parameters,
        body: config.body,
        success: config.success,
        exception: config.exception,
        resetApiCall: config.resetApiCall
      };
    } else if (this.type === 'StaticValue') {
      return {
        valueType: config.valueType,
        value: config.value,
        boolCaseSensitive: config.boolCaseSensitive
      };
    } else if (this.type === 'ContextObject') {
      return {
        value: config.value
      };
    }
     else if (this.type === 'SoapAPI') {
        return {
          apiUri: config.apiUri,
          method: config.method,
          headers: config.headers,
          parameters: config.parameters,
          body: config.body,
          success: config.success,
          exception: config.exception,
          resetApiCall: config.resetApiCall
        };
      }
    }

  /**
   * @description validates JSON value from inputs
   * @param str string value to be validated as JSON
   */
  validateJsonString(str) {
    str = str.trim();
    str = str.startsWith('{') ? str : '{' + str;
    str = str.endsWith('}') ? str : str + '}';
    // replace quotations to be "" on the outsides
    str = str.replace(/'/g, '"');
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return JSON.parse(str);
  }

  /**
   * @description handles form validation
   * @param form the form data to be validated
   */
  validateForm(form) {
    const emptyFields = [];
    const invalidFields = [];

    if (!form.name) emptyFields.push('Variable Name');
    switch (form.type) {
      case 'API':
        if (!form.config.apiUri) emptyFields.push('API URI');
        if (!form.config.method) emptyFields.push('Method');
        if (!form.config.success || !Object.keys(form.config.success).length) emptyFields.push('Success');

        if (form.config.headers && !this.validateJsonString(form.config.headers)) invalidFields.push('Headers');
        else if (form.config.headers) form.config.headers = this.validateJsonString(form.config.headers);

        if (form.config.parameters && !this.validateJsonString(form.config.parameters)) invalidFields.push('Parameters');
        else if (form.config.parameters) form.config.parameters = this.validateJsonString(form.config.parameters);

        if (form.config.body && !this.validateJsonString(form.config.body)) invalidFields.push('Body');
        else if (form.config.body) form.config.body = this.validateJsonString(form.config.body);
        break;
      case 'StaticValue':
        if (!form.config.valueType) emptyFields.push('Value Type');
        if (!form.config.value) emptyFields.push('Value');
        break;
      case 'SoapAPI':
        if (!form.config.apiUri) emptyFields.push('API URI');
        if (!form.config.method) emptyFields.push('Method');
        if (!form.config.success || !Object.keys(form.config.success).length) emptyFields.push('Success');

        if (form.config.headers && !this.validateJsonString(form.config.headers)) invalidFields.push('Headers');
        else if (form.config.headers) form.config.headers = this.validateJsonString(form.config.headers);

        if (form.config.parameters && !this.validateJsonString(form.config.parameters)) invalidFields.push('Parameters');
        else if (form.config.parameters) form.config.parameters = this.validateJsonString(form.config.parameters);

        // if (form.config.body && !this.validateJsonString(form.config.body)) invalidFields.push('Body');
        // else if (form.config.body) form.config.body = this.validateJsonString(form.config.body);
        break;  
      default:
        break;
    }
    return { empty: emptyFields, invalid: invalidFields };
  }

  /**
   * @description handles updates to the API Success fields
   * @param data new Success field data to be set
   */
  updateSuccessValues(data) {
    this.varData = data;
    this.config.success = {};
    for (let i = 0; i < this.varData.length; i++) {
      this.config.success[this.varData[i].title] = this.varData[i].path;
    }
  }

  /**
   * @description reset all error values
   */
  resetErrorValues(): void {
    this.variableNameErrorMessage = '';
    this.variableNameErrorMessage = '';
    this.formError = false;
    this.variableNameError = false;
    this.valueError = false;
    this.apiUriError = false;
    this.headersError = false;
    this.parametersError = false;
    this.bodyError = false;
    this.header_invalidJSONValuesErrorMessage = '';
    this.parameters_invalidJSONValuesErrorMessage = '';
    this.body_invalidJSONValuesErrorMessage = '';
    this.ceFormVariableTypeError = false;
    this.ceFormSuccessError = false;
    this.ceFormMethodError = false;
    this.ceFormValueType = false;
  }

  closeToaster(): void {
    this.formError = false;
  }

  /**
   * @description this allows the engineer to specify if the regex should be case sensitive or not
   * @param {Boolean} data - case sensitive or not
   * @param {String} field - The key to what we are saving the Boolean value to. This will be set to boolCaseSensitive
   */
  onChangeBoolCaseSensitive(data: Boolean, field: string): void {
    this.config[field] = data;
  }
}
