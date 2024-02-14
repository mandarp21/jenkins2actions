import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { INgxMyDpOptions } from 'ngx-mydatepicker';

@Component({
  selector: 'chat-date-picker',
  templateUrl: 'chat-date-picker.component.html',
  styleUrls: ['chat-date-picker.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ChatDatePickerComponent implements OnInit {
  @Output()
  dateSelected = new EventEmitter();
  @Input()
  boolAllowFutureDates: boolean;
  @Input()
  boolAllowPastDates: boolean;

  // datepicker variables
  model: any;
  myOptions: INgxMyDpOptions;

  ngOnInit() {
    const today = new Date();

    // datepicker options
    this.myOptions = {
      dateFormat: 'dd/mm/yyyy',
      selectorHeight: '300px',
      selectorWidth: '300px',
      showSelectorArrow: false,
      sunHighlight: false,
      showTodayBtn: false
    };

    // configure the datepicker according to values it has been set up with from engineering portal
    if (!this.boolAllowFutureDates && this.boolAllowPastDates) {
      //allow past dates only
      this.myOptions.disableSince = {
        year: parseFloat(today.getFullYear().toString()),
        month: parseFloat(today.getMonth().toString()) + 1,
        day: parseFloat(today.getDate().toString())
      };
     } else if (this.boolAllowFutureDates && !this.boolAllowPastDates) {
       //allow future dates only
        this.myOptions.disableDateRanges = [{
         begin: {
          year: 1000,
          month: 1,
          day: 1
         },
         end: {
          year: parseFloat(today.getFullYear().toString()),
          month: parseFloat(today.getMonth().toString()) + 1,
          day: parseFloat(today.getDate().toString())
         }
        }
      ];
     }
  }

  /**
   * @description pass date value to the parent component for it to submit it to the chat
   */
  submitDate() {
    this.dateSelected.emit(this.model['formatted']);
  }
}
