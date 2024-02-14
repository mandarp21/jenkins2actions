import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { FeedbackInterface } from '../../../model/feed-back.interface';

@Component({
    selector: 'converse-bar-chart',
    styleUrls: ['bar-chart.component.sass'],
    templateUrl: 'bar-chart.component.html'
})

/**
* @description A bar chart component that will show a bar chart with variable label
* @param {number} total - this will be the total of the data values coming in, 
* @param {any[]} data - an array of key value pairs to be added to the drop down. In this key is display text and value is what may be of use to backend
* @param {string} icondisplay - the display icon which can be eifhter plus or caret
* @param {string} inwidth - the width of the area in which this drop down is to be contained (all widths etc in the    control are set as % of this width)
*/
export class BarChartComponent implements OnInit {
    _total: number;
    _chartid:string;
    _showRefresh: boolean = true;
    @Input() bardata: any;

    @Input()
    set total(total: any) {
        this._total = total || 1000;
    }
    get total() {
        return this._total;
    }

    @Input()
    set chartid(chartid: string) {
        this._chartid = chartid || '';
    }
    get chartid() {
        return this._chartid;
    }

    @Output() refresh = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { 
        
    }

    onClickRefresh($event) {
        this.refresh.emit();
    }
}
