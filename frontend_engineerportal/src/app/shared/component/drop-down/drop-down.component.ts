import { Component, OnChanges, EventEmitter, Input, Output, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'converse-drop-down',
  styleUrls: ['drop-down.component.sass'],
  templateUrl: 'drop-down.component.html'
})

/**
 * @description A drop down component that can either have caret or plus icon
 * @param {any[]} data - an array of key value pairs to be added to the drop down. In this key is display text and value is what may be of use to backend
 * @param {string} id - suffx to be used as id of all reusable components
 * @param {string} showtitle - the display title to be set as default text of drop down
 * @param {string} icondisplay - the display icon which can be eifhter plus or caret
 * @param {string} inwidth - the width of the area in which this drop down is to be contained (all widths etc in the control are set as % of this width)
 * @param {boolean} activateToolTip - flag to set the tooltip on hover of dropdown control
 * @param {string} tooltipKey - key to fetch the tooltip text from config file
 * @param {boolean} disabled - to disable the dropdown in tooltip activated mode
 * @param {string} placement - position to set the tooltip - top, bottom, none
 */
export class DropDownComponent implements OnChanges {
  @Input()
  data: any[];
  @Input()
  selected: string;
  @Input()
  placeholder: string;
  @Input()
  hasEmptyOption: boolean;
  @Input()
  emptyOptionName: string;
  @Input()
  ceFormVariableTypeError: boolean;
  @Input()
  ceFormMethodError: boolean;
  @Input()
  ceFormValueType: boolean;
  @Input()
  copyChannelError: boolean;
  @Output()
  selchange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  activateToolTip: boolean;
  @Input()
  tooltipKey: string;
  @Input()
  disabled: boolean;
  @Input() placement: string;

  dropdownSize = 10;
  globalListenFunc;

  showDropdown = false;

  /**
   * @description The constructor which is setting default values
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer) {}

  /**
   * @description The ngOnInit which is called first time when component is initialised
   */
  ngOnChanges() {
    // fix data if the array elements do not have either 'key' or 'colName' values
    if (this.data) {
      this.data = this.data.map(item => {
        if (!item.colName) {
          item.colName = item.key;
        } else if (!item.key) {
          item.key = item.colName;
        }
        return item;
      });
    }
  }

  openDropdown() {
    this.showDropdown = true;
    this.globalListenFunc = this.renderer.listenGlobal('document', 'click', event => {
      if (this.elementRef.nativeElement.contains(event.target)) {
      } else this.closeDropdown();
    });
  }

  closeDropdown() {
    this.showDropdown = false;
    this.globalListenFunc();
  }

  /**
   * @description The method called when selected item of drop down is changed
   * @param {any} item - the key value pair of the item selected
   */
  onSelChange(item: any) {
    if (this.selected !== item.colName) {
      if (item === 0) {
        this.selected = undefined;
      } else {
        this.selected = item.colName;
      }
      this.selchange.emit(item);
      this.closeDropdown();

      // don't emit any events if selection hasn't changed
    } else {
      this.closeDropdown();
    }
  }
}
