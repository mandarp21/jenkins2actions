import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { FeedbackInterface } from '../../../model/feed-back.interface';

@Component({
    selector: 'converse-text-display',
    styleUrls: ['text-display.component.sass'],
    templateUrl: 'text-display.component.html'
})
/**
 * @internal
 * This class is a reusable component that displays text based statistics.
 * In this component the input params are
 * titletext
 * statstext
 * unittext
 */
export class TextDisplayComponent implements OnInit {
    @Input() titletext: string;
    @Input() statstext: string;
    @Input() unittext: string;
    @Input() barchartdata: any;
    @Output() refresh = new EventEmitter<string>();
    @Output() hoverevent = new EventEmitter<string>();

    ratingwidth: string;

   /* @Input()
    set barchartdata(data: Array<FeedbackInterface>) {
      //  console.log(data);
        //console.log(data.length);
        if (data) {
            this.barchartdata = data;
         //   console.log(this.barchartdata);
        }
    }
    get barchartdata() {
        return this.barchartdata;
    }
*/
    constructor() {
        this.ratingwidth = '60%';
    }

    ngOnInit() {

    
    }

    onMouseHover($event) {
        this.hoverevent.emit($event);
    }

    onClickRefresh($event) {
        this.refresh.emit(this.titletext);
    }
}
