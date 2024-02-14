import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'converse-date-picker',
    styleUrls: ['date-picker.component.sass'],
    templateUrl: 'date-picker.component.html'
})
/**
 * @internal
 * This class is a reusable component that displays date picker.
 * In this component the input params are
 * id - suffix to the id of all html elements in this page
 * type - which gives a identifier of each instance of data picker
 * date - gives the initial date value to be used and also represents the date value selected
 * maxdate - gives the max value date picker can have
 * mindate - gives the min value date picker can have
 *
 * It emits datechange event
 */
export class DatePickerComponent {

    dateObj: Date;
    maxDateObj: Date;
    minDateObj: Date;
    @Input() id: string;
    @Input() type: string;
    @Input()
    set date(date: any) {
        this.dateObj = (new Date(date)) || new Date();
    }
    get date() {
        return this.dateObj;
    }

    @Input()
    set maxDate(date: any) {
        this.maxDateObj = (new Date(date)) || new Date();
    }
    get maxDate() {
        return this.maxDateObj;
    }

    @Input()
    set minDate(date: any) {
        this.minDateObj = (new Date(date)) || new Date();
    }
    get minDate() {
        return this.minDateObj;
    }

    @Output() dateChanged: EventEmitter<{ type: string, date: Date }> = new EventEmitter<{ type: string, date: Date }>();


    constructor() {
    }

    onChange($event) {
        this.dateChanged.emit({ type: this.type, date: new Date($event) });
    }
}
