import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'converse-button',
  styleUrls: ['button.component.sass'],
  template: `
    <input *ngIf="!iconType"
      [ngClass]="[buttonClass, rounded ? 'roundBtn' : '', ceFormSuccessError ? 'roundBtn-error' : '', type || '']"
      class="button-converse"
      [disabled]="isDisabled"
      type="{{ inputType }}"
      value="{{ val }}"
      id="{{ id }}"
    />
    <div *ngIf="type === 'add'" class="add-button-plus"></div>
    <button *ngIf="iconType == 'import'" [ngClass]="[buttonClass]"  class="button-converse">{{ val }}<span [ngClass]="[iconClass]"></span></button>
    <button *ngIf="iconType == 'export'"  [ngClass]="[buttonClass]" class="button-converse">{{ val }}<span [ngClass]="[iconClass]"></span></button>
  `
})

/**
 * @description A button component that can either be green or grey
 * @param {string} id - A unique id to set to the button element
 * @param {string} val - the value to set for the button element
 * @param {boolean} boolGreen - Setting this to true will produce a green button. Default will be grey
 * @param {string} type - Optional - Allows you to specify the type of input i.e. 'submit'. If not specified, set to 'button'
 * @param {boolean} isDisabled - Setting this to true will disable the button. Default will be false
 */
export class ButtonComponent implements OnChanges {
  @Input()
  id: string;
  @Input()
  val: string;
  @Input()
  boolGreen: boolean;
  @Input()
  boolDeleteButton: boolean;
  @Input()
  type?: string;
  @Input()
  isDisabled: boolean;
  @Input()
  activateColors: boolean;
  @Input()
  rounded: boolean;
  @Input()
  boolWhite: boolean;
  @Input()
  ceFormSuccessError: boolean;
  @Input() iconType: string;
  buttonClass: string;
  inputType: string;
  iconClass: string;

  ngOnChanges() {
    this.inputType = this.type ? this.type : 'button';
    if (this.activateColors) {
      // if you want it to be used for validation, colors will change depending on whether button is disabled or not
      this.buttonClass = this.isDisabled ? 'btnDisabled' : 'btnGreen';
    } else {
      // if you want to manually specify the colors
      if (this.boolGreen) {
        this.buttonClass = 'btnGreen';
      } else if (this.boolDeleteButton) {
        this.buttonClass = 'btnDelete';
      } else if (this.boolWhite) {
        this.buttonClass = 'btnWhite';
      } else if (this.iconType === 'import') {
        this.buttonClass = 'btnExportImport';
        this.iconClass = 'iconImport';
      } else if (this.iconType === 'export') {
        this.buttonClass = 'btnExportImport';
        this.iconClass = 'iconExport';
      } else {
        this.buttonClass = 'btnGray';
      }
    }
  }
}
