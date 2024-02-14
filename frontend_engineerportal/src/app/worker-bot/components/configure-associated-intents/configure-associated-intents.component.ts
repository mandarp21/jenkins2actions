import { Component, Output, Input, EventEmitter } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'converse-configure-associated-intents',
  styleUrls: ['configure-associated-intents.component.sass'],
  templateUrl: 'configure-associated-intents.component.html'
})

/**
 * @internal
 * This class is a  component that displays master configuration.
 *
 */
export class ConfigureAssociatedIntentsComponent {
  @Input() intentsList: any;
  saveIntentList: any; // TODO add type
  addedIntent: string;
  isSelected: boolean;
  @Output() intentListEmitter = new EventEmitter(); // TODO add type
  reOrderList = [{ value: 'reOrderAlpha', key: 'Alphabetic' },
  { value: 'reOrderSelected', key: 'Selected' }];
  recordName = 'Sort';
  iconcaret = 'caret';
  toolTipFlag = true;

  constructor(private util: UtilService) {
  }

  addIntent(intent) {
    this.intentsList.push({
      intentName: intent, selected: true
    });
    this.addedIntent = '';
    this.emitSelectedIntentList();
  }

  selectIntent(intent) {
    const index = this.intentsList.findIndex(function (item) {
      return item.intentName === intent;
    });

    if (index > -1) {
      this.intentsList[index].selected = intent.selected;
    }
    this.emitSelectedIntentList();
  }

  onSelchange(item) {
    let data;
    if (item.value === 'reOrderAlpha') {
      data = this.util.sortArray(this.intentsList, 'intentName', 'asc');
    } else {
      data = this.util.sortArray(this.intentsList, 'selected', 'desc');
    }
    this.intentsList = data;
  }

  intentSelection(intent) {
    intent.selected = !intent.selected;
    this.selectIntent(intent);
  }

  emitSelectedIntentList() {
    // TODO check if only selected intents need to be saved, if not then selectedList can be removed and intentList can be passed
    const selectedList = this.intentsList.filter((item) => item.selected);
    this.intentListEmitter.emit(selectedList)
  }
}
