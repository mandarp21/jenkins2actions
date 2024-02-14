import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'converse-filter-dialog',
  styleUrls: ['conversation-filter.component.sass'],
  templateUrl: 'conversation-filter.component.html'
})
export class ConversationFilterComponent implements OnInit {
  @Input() itemList;
  @Input() selectedList;
  @Input() placeTxt: string;
  filterTxt: string;
  filteredList: Array<string>;

  @Output() closeClickEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    this.filterTxt = '';
    this.filteredList = this.itemList;
  }

  closeDialog() {
    let idx = 0;
    for (; idx < this.itemList.length; idx++) {
      if (this.itemList[idx].selected)
        this.selectedList.push(this.itemList[idx].value);

    }

    this.closeClickEvent.emit();
  }

  resetDialog() {
    //clear all selection

    let idx = 0;
    for (; idx < this.itemList.length; idx++) {
      this.itemList[idx].selected = false;

    }
  }

  itemSelection(filterItem) {

    if (filterItem.value === 'Select All') {
      let idx = 1;
      for (; idx < this.itemList.length; idx++) {
        this.itemList[idx].selected = true;

      }
      return;
    }

    const index = this.itemList.findIndex(function (item) {
      return item.value === filterItem.value;
    });

    if (index > -1) {
      this.itemList[index].selected = !filterItem.selected;
    }
  }

  /**
   * @internal
   * This method is called on click of search icon in intents filter pop up
   */

  filterItems(searchVal?: string): void {
    this.filterTxt = (searchVal) ? searchVal : this.filterTxt;
    if (this.filterTxt.length > 2) {
      this.filteredList = this.itemList.filter(
        (item: any) => {
          return (item.value.toLocaleLowerCase().indexOf(this.filterTxt.toLocaleLowerCase()) !== -1);
        });
    } else {
      this.filteredList = this.itemList;
    }
  }
}
