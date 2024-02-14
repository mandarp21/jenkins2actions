import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkerBotService } from 'src/app/worker-bot/services/worker-bot.service';

@Component({
  selector: 'custom-values-list',
  styleUrls: ['custom-values-list.component.sass'],
  templateUrl: 'custom-values-list.component.html'
})
export class CustomValuesListComponent implements OnChanges {
  @Input()
  data: any;
  @Input()
  type: string;
  @Input()
  selected: any;
  @Input()
  ceFormSuccessError: boolean;
  @Output()
  valueChange = new EventEmitter();

  inputOpen = false;
  entityName: string;
  entityValue: string;
  entityPrompt: string;

  title: string;
  path: string;

  variable: string;

  entityValuesOptions;
  selectedEntityValues;

  customValueTypes = {
    entity: {
      fields: [
        {
          name: 'entityName',
          title: 'Entity Name',
          type: 'dropdown',
          required: true
        },
        {
          name: 'entityValue',
          title: 'Entity Value',
          dropdownOptionTitle: 'Any Value',
          type: 'dropdown',
          required: false
        },
        {
          name: 'entityPrompt',
          title: 'User Prompt (if missing)',
          placeholder: 'User Prompt',
          required: false
        }
      ],
      buttonTitle: 'Add Entity'
    },
    'entity-condition': {
      fields: [
        {
          name: 'entityName',
          title: 'Entity Name',
          type: 'dropdown',
          required: true
        },
        {
          name: 'entityValue',
          title: 'Entity Value',
          dropdownOptionTitle: 'Any Value',
          type: 'dropdown',
          required: false
        }
      ],
      buttonTitle: 'Add Entity'
    },
    apiSuccess: {
      fields: [
        {
          name: 'title',
          title: 'Title',
          required: true
        },
        {
          name: 'path',
          title: 'Path',
          required: true
        }
      ],
      buttonTitle: 'Add Success Value'
    },
    variables: {
      fields: [
        {
          name: 'variable',
          title: 'Select Variable',
          type: 'dropdown',
          required: true
        }
      ],
      buttonTitle: 'Add Variable'
    }
  };

  constructor(private toastr: ToastrService, private workerBotService: WorkerBotService) {
    // get the Entity Values list
    this.workerBotService.entityListValuesObs.subscribe(data => {
      this.entityValuesOptions = data ? data : [];
    });
  }

  ngOnChanges() {
    this.selected = this.selected && typeof this.selected === 'object' ? JSON.parse(JSON.stringify(this.selected)) : [];
    this.inputOpen = false;
  }

  /**
   * @description validates the form
   */
  isFormUnfinished() {
    if (this.type === 'entity' && !this.entityName) return true;
    if (this.type === 'entity-condition' && !this.entityName) return true;
    else if (this.type === 'apiSuccess' && (!this.title || !this.path)) return true;
    else if (this.type === 'variables' && !this.variable) return true;
    else return false;
  }

  /**
   * @description handles click event of the add button
   */
  addButtonClick() {
    if (!this.inputOpen) {
      this.inputOpen = true;
    }
  }

  /**
   * @description adds new value to the selected list
   */
  addSelected() {
    if (this.type === 'entity') {
      const entity = { entityName: this.entityName, entityValue: this.entityValue };
      if (this.entityPrompt) {
        entity['entityPrompt'] = this.entityPrompt;
      }
      this.selected.push(entity);
      this.valueChange.emit(this.selected);
    } else if (this.type === 'entity-condition') {
      this.selected.push({ entityName: this.entityName, entityValue: this.entityValue });
      this.valueChange.emit(this.selected);
    } else if (this.type === 'apiSuccess') {
      this.selected.push({ title: this.title, path: this.path });
      this.valueChange.emit(this.selected);
    } else if (this.type === 'variables') {
      this.selected.push(this.variable);
      this.valueChange.emit(this.selected);
    }
  }

  /**
   * @description removes item from the list
   * @param index the index of the item to remove in the selected array
   */
  removeSelected(index) {
    this.selected.splice(index, 1);
    this.valueChange.emit(this.selected);
  }

  /**
   * @description closes the input field box and clears the values
   */
  closeInputFields() {
    this.inputOpen = false;
    if (this.type === 'entity') {
      this.entityName = '';
      this.entityValue = '';
      this.selectedEntityValues = [];
    } else if (this.type === 'entity-condition') {
      this.entityName = '';
      this.entityValue = '';
    } else if (this.type === 'apiSuccess') {
      this.title = '';
      this.path = '';
    } else if (this.type === 'variables') {
      this.variable = '';
    }
  }

  /**
   * @description handles clicking the save button for the small form
   */
  saveInput() {
    if (this.isFormUnfinished()) {
      this.toastr.error('Please fill out all required fields!', 'Error adding ' + this.type);
    } else {
      this.addSelected();
      this.closeInputFields();
    }
  }

  /**
   * @description dropdown selection change event handler
   * @param data dropdown option selected
   * @param fieldName data field to map the value to
   */
  changeSelectedItem(data, fieldName) {
    this[fieldName] = data.key;
    if (fieldName === 'entityName') {
      this.selectedEntityValues = this.entityValuesOptions[data.key] || [];
    }
  }

  /**
   * @description returns relevant dropdown list data
   * @param fieldName field to get data for
   */
  getDropdownData(fieldName) {
    if (fieldName === 'entityName' || fieldName === 'variable') {
      return this.data;
    } else if (fieldName === 'entityValue') {
      return this.selectedEntityValues;
    }
  }
}
