import { Component, AfterViewInit, EventEmitter, Input, Output, ElementRef, Renderer2, OnChanges, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'converse-drop-down-multiple',
  styleUrls: ['drop-down-multiple.component.sass'],
  templateUrl: 'drop-down-multiple.component.html'
})

/**
 * @description A drop down component that can either have caret or plus icon
 * @param {any[]} data - an array of key value pairs to be added to the drop down. In this key is display text and value is what may be of use to backend
 * @param {string} id - suffx to be used as id of all reusable components
 * @param {string} showtitle - the display title to be set as default text of drop down
 * @param {string} icondisplay - the display icon which can be eifhter plus or caret
 * @param {string} inwidth - the width of the area in which this drop down is to be contained (all widths etc in the    control are set as % of this width)
 */
export class DropDownComponentMultiple implements AfterViewInit, OnChanges, AfterViewChecked {
  @Input('data')
  data: any[];
  @Input()
  showtitle: string;
  @Input()
  selected: any;
  @Output()
  selchange: EventEmitter<any> = new EventEmitter<any>();
  icondisplay: Array<string>;
  elementRef: ElementRef;
  dropdowns: any[];
  resetDropdownsList: boolean;
  tempSelected: any;
  /**
   * @description The constructor which is setting default values
   */
  constructor(el: ElementRef, private renderer: Renderer2) {
    this.selected = typeof this.selected === 'object' ? this.selected : [];
    this.elementRef = el;
  }

  /**
   * @description The ngOnInit which is called first time when component is initialised
   */
  ngAfterViewInit() {
    this.getDropdownsList();
  }

  /**
   * @description lifecycle hook that triggers every time the form is opened
   */
  ngOnChanges() {
    this.icondisplay = [];
    if (this.data && typeof this.data === 'object' && this.data.length > 0) {
      if (this.data[0].key) {
        this.data = [this.data];
      }
    } else {
      this.data = [[]];
    }

    // convert entity data to new format if it is in the old one
    this.selected = typeof this.selected === 'object' ? this.selected : [];
    for (let i = 0; i < this.selected.length; i++) {
      if (typeof this.selected[i] === 'string') {
        this.selected[i] = { entityName: this.selected[i], entityValue: null };
      }
    }
    this.tempSelected = JSON.parse(JSON.stringify(this.selected));

    if (this.data.length < this.selected.length && this.data.length > 0) {
      for (let i = 1; i < this.selected.length; i++) {
        this.data.push(this.data[0]);
      }
    } else if (this.data.length > 0 && this.selected.length === 0) {
      this.data = [this.data[0]];
    } else if (this.data.length > this.selected.length && this.data.length > 1) {
      this.data.splice(this.selected.length - 1, this.data.length);
    }

    if (this.selected.length > 1) {
      this.selected.forEach((value, i) => {
        if (i === 0) {
          this.icondisplay.push('plus');
        } else {
          this.icondisplay.push('del');
        }
      });
    } else if (this.selected.length === 1) {
      this.icondisplay = ['plus'];
    } else {
      this.icondisplay = ['caret'];
    }
    this.resetDropdownsList = true;
  }

  /**
   * @description lifecycle hook for every change after the nativeElements have updated
   */
  ngAfterViewChecked() {
    if (this.resetDropdownsList) {
      this.getDropdownsList();
      this.resetDropdownsList = false;
    }
  }

  /**
   * @description renew the nativeElement array for the dropdowns
   */
  getDropdownsList() {
    this.dropdowns = [];
    const dropdownParents = this.elementRef.nativeElement.children;
    for (let i = 0; i < dropdownParents.length; i++) {
      this.dropdowns.push(dropdownParents[i].lastChild);
    }
  }

  /**
   * @description open or close the dropdown menu
   * @param index - index of the dropdown
   * @param action - if false, will always close the dropdown menu
   */
  toggleDropdownMenu(index, action?) {
    if (action === false) {
      this.renderer.removeClass(this.dropdowns[index].lastChild, 'show');
    } else if (this.dropdowns[index].lastChild.classList.value.indexOf('show') === -1) {
      this.renderer.addClass(this.dropdowns[index].lastChild, 'show');
    } else {
      this.renderer.removeClass(this.dropdowns[index].lastChild, 'show');
    }
  }

  /**
   * @description handles click event for the dropdown button
   * @param index - index of the dropdown
   */
  onButtonClick(index) {
    if (
      this.icondisplay[index] === 'plus' &&
      this.icondisplay[this.icondisplay.length - 1] !== 'caret' &&
      this.data[0].length > this.selected.length
    ) {
      this.data.push(this.data[0]);
      this.icondisplay.push('caret');
      this.resetDropdownsList = true;
      this.selected.push(null);
    } else if (this.icondisplay[index] === 'caret') {
      this.toggleDropdownMenu(index);
    } else if (this.icondisplay[index] === 'del') {
      this.data.splice(index, 1);
      this.selected.splice(index, 1);
      this.icondisplay.splice(index, 1);
      this.selchange.emit(this.selected);
    }
  }

  /**
   * @description checks if the item with the key provided is already selected
   * @param key - key of the item to check for
   */
  isItemSelected(key) {
    return this.tempSelected.find(item => item.entityName === key) !== undefined;
  }

  /**
   * @description The method called when selected item of drop down is changed
   * @param {any} item - the key value pair of the item selected
   * @param index - index of the dropdown
   */
  onSelChange(item: any, index) {
    this.tempSelected[index] = { entityName: item.colName, entityValue: null };
    if (item === 0) {
      this.icondisplay = ['caret'];
    } else {
      this.icondisplay[index] = index === 0 ? 'plus' : 'del';
    }
    this.toggleDropdownMenu(index);
    this.selchange.emit(this.tempSelected);
  }
}
