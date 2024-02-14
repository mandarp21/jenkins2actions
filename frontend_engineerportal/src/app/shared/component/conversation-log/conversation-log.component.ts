import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { DateFilter } from '../../../model/date-filter.interface';
import { forEach } from '@angular/router/src/utils/collection';
import { WorkerBotService } from 'src/app/worker-bot/services/worker-bot.service';
import { ConversationLog } from 'src/app/model/conversation-log';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'converse-conversation-log',
  styleUrls: ['conversation-log.component.sass'],
  templateUrl: 'conversation-log.component.html'
})

/**
 * @internal
 * This class is a  component that displays conversation log.
 *
 */
export class ConversationLogComponent implements OnInit {
  @Input('botid')
  botid: string;
  @Input('botname')
  botname: string;

  toMaxDate: string;
  fromMaxDate: string;
  fromDate: string;
  toDate: string;
  toMinDate: string;
  dateFilter: DateFilter;

  itemHeaders: any;
  itemList: any;
  selectedItems: any;
  filterCol: string;
  filterText: string;
  isDetailsShown: boolean;
  isFiltersShown: boolean;
  conversationDetails: any;
  conversationHeaders: any;
  conversationList: any;
  convFilteredList: any;
  conversationLog: boolean;
  selectedRow: number;
  skip: number = 0;
  sort: number;
  useCaseList: any;
  logUpdate: any;
  disableButtonPrev: boolean;
  disableButtonNext: boolean;

  //set number of items per page
  limit: number = 10;

  constructor(private appService: WorkerBotService, private utilService: UtilService) {
    this.toDate = moment().format('DD-MMM-YYYY');
    this.fromDate = moment()
      .subtract(1, 'months')
      .format('DD-MMM-YYYY');
    this.toMaxDate = moment().format('DD-MMM-YYYY');
    this.fromMaxDate = moment()
      .subtract(1, 'days')
      .format('DD-MMM-YYYY');
    this.toMinDate = moment(
      moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD')
    )
      .add(1, 'days')
      .format('DD-MMM-YYYY');
    this.setDateFilter({ fromDate: this.fromDate, toDate: this.toDate });
    this.conversationLog = true;
    this.disableButtonPrev = false;
    this.disableButtonNext = false;
  }
  ngOnInit() {
    this.conversationHeaders = [
      { headerName: 'Use Case', colname: 'useCaseName', width: '30%', type: 'text', noSort: true, filter: true },
      { headerName: 'Channel', colname: 'channel', width: '20%', type: 'text', noSort: true, filter: true },
      { headerName: 'Use Case Status', colname: 'useCaseStatus', width: '25%', type: 'text', noSort: true, filter: true },
      {
        headerName: 'Start Date & Time',
        colname: 'startTimestamp',
        width: '28%',
        type: 'text',
        noSort: false,
        filter: false,
        isDate: true
      },
      { headerName: 'User Id', colname: 'userId', width: '50%', type: 'text', noSort: true, filter: true}
    ];

    this.getUseCaseList();
    this.itemList = null;
    this.selectedItems = [];
    this.logUpdate = [];
    this.getConversationList();
    if (this.skip == 0) {
      this.disableButtonPrev = true;
    }
    console.log(this.botid);
  }

  private setDateFilter(datefilter: DateFilter) {
    this.dateFilter = datefilter;
  }

  getUseCaseList() {
    this.appService
      .getListUseCases(this.botid)
      .subscribe(
        (data: any) => {
          this.useCaseList = data
        },
        error => {
          this.useCaseList = [];
        }
      );
  }

  getConversationList() {
    // TODO pass bot id from route
    this.appService
      .getConversationLog(this.botid, moment(this.dateFilter.toDate).format('DDMMYY'), moment(this.dateFilter.fromDate).format('DDMMYY'), this.skip, this.logUpdate, this.sort, this.limit)
      .subscribe(
        (data: any) => {
          this.conversationList = data;
          this.convFilteredList = data;
          console.log('Data: ', data);
        },
        error => {
          // this needs to be removed and table should display proper error message
          this.convFilteredList = [];
        }
      );
  }

  getConversationDetails(convId: string, botID: string, useCaseLogId: string) {
    this.appService.getConversationDetails(convId, botID).subscribe(
      (data: any) => {
        const filteredList: ConversationLog[] = this.convFilteredList.filter((objConv: ConversationLog) => objConv.useCaseLogId === useCaseLogId);
        this.conversationDetails = {
          sessionId: filteredList[0].sessionId,
          status: filteredList[0].useCaseStatus,
          name: filteredList[0].useCaseName,
          dateTime: filteredList[0].startTimestamp,
          channel: filteredList[0].channel
        };

        this.itemList = [];
        for (let x = 0; x < data.length; x++) {
          // TODO: Need proper fix to remove 'welcome' in the start of conversation logs
          if (data[x].userMessage === 'welcome') {
            this.itemList.push({ sender: this.botname, userMessage: data[x].response.response, timestamp: data[x].timestamp });
          } else {
            this.itemList.push({ sender: 'User', userMessage: data[x].userMessage, timestamp: data[x].timestamp });
            this.itemList.push({ sender: this.botname, userMessage: data[x].response.response, timestamp: data[x].timestamp });
          }
        }
      },
      error => { }
    );
  }
  hideDetails() {
    this.itemList = null;
    this.itemHeaders = null;
    this.conversationDetails = null;
    this.selectedRow = -1; //for changing conversation log active row background color
  }

  showConversationDetails(id: any): void {
    this.selectedRow = id.i; //for changing conversation log active row background color
    const useCaseLogId = id.useCaseLogId
    id = id.item;
    if (id.indexOf('-') > -1) {
      this.itemHeaders = [
        { headerName: 'Sender', colname: 'sender', width: '20%' },
        { headerName: 'Content', colname: 'userMessage', width: '55%' },
        { headerName: 'Time', colname: 'timestamp', width: '25%' }
      ];
      this.getConversationDetails(id, this.botid, useCaseLogId);
    } else {
      if (this.isFiltersShown === true) {
        // to show and hide filter popup
        this.isFiltersShown = false;
        return;
      }

      this.isFiltersShown = true;

      // if details of a conversation are displayed they will be hidden before showing the filter
      if (this.itemList.length > 0) {
        this.hideDetails();
      }

      // fill in the list of values to be displayed as filter
      let idx = 0;
      let itemStrArr = [];
      this.selectedItems = [];
      this.itemList.push({ selected: false, value: 'Select All' });

      for (; idx < this.conversationList.length; idx++) {
        const conv = this.conversationList[idx][id];

        if (itemStrArr.indexOf(conv) === -1) {
          // uniqueness check
          this.itemList.push({ selected: false, value: conv });
          itemStrArr.push(conv);
        }
      }
      itemStrArr = [];
      itemStrArr = undefined;

      idx = 0;
      for (; idx < this.conversationHeaders.length; idx++) {
        if (id === this.conversationHeaders[idx].colname) {
          this.filterCol = this.conversationHeaders[idx].colname;
          this.filterText = 'Search for a ' + this.conversationHeaders[idx].headerName;
          break;
        }
      }
    }
  }

  /**
   * @internal
   * This method handles the data change event from data picker control.
   */
  onDateChanged($event: { type: string; date: Date }) {
    if ($event.type === 'toDate') {
      this.toDate = moment($event.date.toISOString()).format('DD-MMM-YYYY');
      this.fromMaxDate = moment($event.date.toISOString())
        .subtract(1, 'days')
        .format('DD-MMM-YYYY');
    }
    if ($event.type === 'fromDate') {
      this.fromDate = moment($event.date.toISOString()).format('DD-MMM-YYYY');
      this.toMinDate = moment($event.date.toISOString())
        .add(1, 'days')
        .format('DD-MMM-YYYY');
    }
  }

  handleClick(btnText: string) {
    this.setDateFilter({ fromDate: this.fromDate, toDate: this.toDate });
    this.skip = 0;
    this.disableButtonPrev = true;
    this.getConversationList();
  }

  /**
   * @internal
   * This method handles page change event from conversation logs table
   */
  pageChange(state) {
    if (state === 'prev') {
      this.skip = this.skip - this.limit
    } else {
      this.skip = this.skip + this.limit
    }

    if (this.skip > 0){
      this.disableButtonPrev = false;
    } else {
      this.disableButtonPrev = true;
    }
    this.getConversationList();
  }

  /**
   * @internal
   * This method handles filter change event from conversation logs table
   */
  updateLogsFilter(event) {
    this.logUpdate = event;
    this.skip = 0;
    this.disableButtonPrev = true;
    this.getConversationList();
  }

  /**
   * @internal
   * This method handles sort change event from conversation logs table
   */
  updateLogsSort(event) {
    this.sort = event;
    this.skip = 0;
    this.disableButtonPrev = true;
    this.getConversationList();
  }

  /**
   * @internal
   * This method disable a button when a condition met in filtering conversation logs
   */
  disablePageButtons(event) {
    this.skip = 0;
    this.disableButtonPrev = true;
    this.disableButtonNext = event;
  }
}
