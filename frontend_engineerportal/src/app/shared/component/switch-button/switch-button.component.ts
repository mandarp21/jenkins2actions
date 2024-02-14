import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'converse-switch-button',
  styleUrls: ['switch-button.component.sass'],
  template: `
  <div class='toggle-switch-container'>
    <label class="switch">
      <input [disabled]="disabled" type="checkbox" [checked]="checked" #switchButton (change)="emitStatus(switchButton.checked)">
      <span [activateToolTip]="toggleToolTip" [placement]="placement" [converse-tooltip]="tooltipKey" class="slider round"></span>
    </label>
  </div>
  `
})

/**
 * @description A checkbox switch button component
 * @param {boolean} checked - to set checkbox value
 * @param {EventEmitter<boolean>} handleChangeEvent - Event emitter to emit checkbox status on change event
 * @param {boolean} toggleToolTip - flag to set the tooltip on hover of switch button control
 * @param {string} tooltipKey - key to fetch the tooltip text from config file
 * @param {boolean} disabled - to disable the dropdown in tooltip activated mode
 * @param {string} placement - position to set the tooltip - top, bottom, none
 */
export class SwitchButtonComponent {
  @Input() checked: boolean;
  @Input() disabled: boolean;
  @Input() toggleToolTip: boolean;
  @Input() tooltipKey: string;
  @Input() placement: string;
  @Output() handleChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    this.checked = false;
    this.disabled = false;
  }

  /**
   * @description - method called on the checkbox change event
   */
  emitStatus(isChecked: boolean): void {
    this.checked = !this.checked;
    this.handleChangeEvent.emit(isChecked);
  }
}
