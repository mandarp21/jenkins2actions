import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { isType } from '@angular/core/src/type';

@Component({
	selector: 'converse-data-table',
	styleUrls: ['data-table.component.sass'],
	templateUrl: 'data-table.component.html'
})
export class DataTableComponent implements OnInit {

	@Input() itemheaders: any[];
	@Input('itemlist') itemlist: any[];
	@Output() clickEventEmitter = new EventEmitter<string>();
	@Output() convEventEmitter = new EventEmitter<string>();
	@Output() nlpTrainerEventEmitter = new EventEmitter<any>();
	@Output() hoverevent = new EventEmitter<string>();
	@Input() conversationLog: boolean;
	@Input() paginationFlag: boolean;
	@Input() displayCount: number;
	@Input() toggleToolTipTable: boolean;

	colName: string;
	sortOrder: string;
	dropwidth: string;
	intentname: string;
	iconcaret: string;
	iconleft: string;
	filterOn: boolean;
	selectedIndex: number;
	showLessFlag: boolean;

	constructor(private util: UtilService) {
		this.dropwidth = '14em';
		this.iconcaret = 'caret';
		this.intentname = 'ReplaceData';
		this.iconleft = '8em';
		this.filterOn = false;
		this.showLessFlag = false;
	}

	ngOnInit() {

	}

	sortCol(colName: string, order: string) {
		this.colName = colName;
		this.sortOrder = order;
		let data = this.util.sortArray(this.itemlist, colName, order);
		this.itemlist = data;
	}

	showFilter(colName: string) {

		if (colName == this.colName) {
			this.filterOn = !this.filterOn;
		}
		else {
			this.filterOn = true;
		}

		this.colName = colName;
		this.clickEventEmitter.emit(this.colName);
		// show a filter widget with all possible values
	}

	onMouseHover(item) {
    let id = item.botId;
    if (id && id.length > 1) {
			id = id.replace(/\s/g, '-');
			this.hoverevent.emit(id);
		}
  }

	onRowClick(id) {
		if (id && id.length > 1) {
			id = id.replace(/\s/g, '-');
			this.clickEventEmitter.emit(id);
		}
	}

	onConvClick(item, i) {
		if (item.uttername !== undefined) {
			return; // this condition is added to prevent intent filter poup to open on click of other rows
		}

		this.selectedIndex = i;
		let id = item.sessionId;

		if (id) {
			id = id.replace(/\s/g, '-');
			this.clickEventEmitter.emit(id);
		}
	}

	updateNLPItem(item, i, colName) {

		if (typeof (item) === 'object') {
			// get the option selected from the dropdown and update the displayed dropdown
			item = item.key
			this.itemlist[i]['selectedOption'] = item;
		} else {
			// Update the text area
			this.itemlist[i][colName] = item;
		}
	}

	emitUtteranceEvent(i, status) {
		let item = this.itemlist[i];
		item['status'] = status
		this.nlpTrainerEventEmitter.emit(item);
	}

	/**
	 * @internal
	 * This method is called on click of show more button
		   in reclassify uttrances table in train-nlp page
	 */

	loadMore() {
		this.displayCount = this.displayCount + 10;
		if (this.itemlist.length <= this.displayCount) {
			this.paginationFlag = false;
			this.showLessFlag = true;
		}
	}

	/**
	 * @description  This method is called on click of show less button
		   in reclassify uttrances table in train-nlp page
	 */
	showLess() {
		this.showLessFlag = false;
		this.paginationFlag = true;
		this.displayCount = 10;
	}

	/**
	 * @description This method is called on click of dialogue/speech icon in uttrance column in reclassify uttrance list table
	 */

	showNlpLogs(item: any) {
		let id = item.sessionId;

		if (id) {
			id = id.replace(/\s/g, '-');
			this.clickEventEmitter.emit(id);
		}
	}
}
