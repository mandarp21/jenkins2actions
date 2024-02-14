import { Component, Input, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.sass']
})
/**
 * @description - Component to show pop modal for confirmation
 * @param {@Input() boolean} opener - to keep state of the component open/close
 * @param {@Output() EventEmitter<boolean> } handleConfirmClickEvent - to emit user selection
 * @param {any} modalInsatance - to keep ngx-smart-modal instance
 * @param {string} type - to delete either bot | use case
 */
export class PopupModalComponent implements OnChanges, AfterViewInit {

  @Input() opener: boolean;
  @Input() type: string;
  @Input() operation: string;
  @Input() rejectBtnTxt: string;
  @Input() confirmBtnTxt: string;
  @Output() handleConfirmClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  modalInsatance: any;
  constructor(private ngxSmartModelService: NgxSmartModalService) {
    this.opener = false;
    this.type = 'bot'
    this.operation = 'delete';
    this.rejectBtnTxt = 'Cancel';
    this.confirmBtnTxt = 'Confirm';
  }

  ngOnChanges(): void {
    if (this.opener) {
      this.modalInsatance.open();
    }
  }

  /**
   * @description - method to get and emit user selection 
   * @param {boolean} isConfirmed - user selection status
   */
  deleteConfirmed(isConfirmed: boolean): void {
    this.handleConfirmClickEvent.emit(isConfirmed);
    this.opener = false;
    this.modalInsatance.close();
  }

  ngAfterViewInit(): void {
    this.modalInsatance = this.ngxSmartModelService.getModal('modal');
  }

}
