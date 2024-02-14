import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'converse-textbox',
  styleUrls: ['textbox.component.sass'],
  template: `
    <input
      class="textbox-converse"
      placeholder="{{ placeholder }}"
      type="text"
      value="{{ val }}"
      id="{{ id }}"
      [ngClass]="{ 'search-icon': searchIcon }"
      (keyup)="onKeyUp(converseTextbox.value)"
      #converseTextbox
    />
  `
})

/**
 * @description A button component that can either be green or grey
 * @param {string} id - A unique id to set to the button element
 * @param {string} val - the value to set for the button element
 */
export class TextBoxComponent {
  @Input() id: string;
  @Input() val: string;
  @Input() placeholder: string;
  @Input() searchIcon: boolean;
  @Output() handleKeyUp = new EventEmitter<string>();

  onKeyUp(value: string) {
    this.handleKeyUp.emit(value);
  }
}
