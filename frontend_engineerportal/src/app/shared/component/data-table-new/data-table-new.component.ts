import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'converse-data-table-new',
  styleUrls: ['data-table-new.component.sass'],
  templateUrl: 'data-table-new.component.html'
})
export class DataTableNewComponent implements OnInit, OnChanges {
  @Input()
  itemheaders: any[];
  @Input()
  itemlist: any[];
  @Input()
  usecaselist: any[];

  @Output()
  clickEventEmitter = new EventEmitter<any>();
  @Output()
  customAction: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  updateLogsFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  updateLogsSort: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  disablePageButtons: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  conversationLog: boolean;
  @Input()
  selectedRow: number;

  sort: any = {};
  filter: any = {};
  visibleItemlist: any[];
  openFilterDropdown = null;
  openFilterBox = null;
  intentsFilterValue = '';
  filteredItems: any[];
  toggleDropdown = false;

  listSize = 100;
  logFilter: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    //if the data table was being use by conversation log
    if (this.usecaselist) {
      if (this.logFilter) {
        this.itemheaders.forEach(header => {
          if (header.isDate && this.itemlist) {
            this.itemlist.forEach(item => {
              item[header.colname] = formatDate(item[header.colname], 'short', 'en-UK');
            });
          }
        });
      } else {
        this.filter = {};
        this.itemheaders.forEach(header => {
          if (header.isDate && this.itemlist) {
            this.itemlist.forEach(item => {
              item[header.colname] = formatDate(item[header.colname], 'short', 'en-UK');
            });
          }

          if (header.filter && this.itemlist) {
            this.filter[header.colname] = { selected: [], options: [] };
            this.usecaselist.forEach(item => {
              if (this.filter[header.colname].options.indexOf(item[header.colname]) < 0) {
                this.filter[header.colname].options.push(item[header.colname]);
                this.filter[header.colname].selected.push(item[header.colname]);
              }
            });
          }
        });
      }
    } else {
      //data table was not being used by conversation logs
      if (this.filteredItems && this.filteredItems.length > 0) {
        this.filteredItems = this.filteredItems;
      } else {
        this.filteredItems = this.itemlist ? JSON.parse(JSON.stringify(this.itemlist)) : [];
        this.filter = {};
        this.itemheaders.forEach(header => {
          if (header.isDate && this.itemlist) {
            this.itemlist.forEach(item => {
              item[header.colname] = formatDate(item[header.colname], 'short', 'en-UK');
            });
          }

          if (header.filter && this.itemlist) {
            this.filter[header.colname] = { selected: [], options: [] };
            this.itemlist.forEach(item => {
              if (this.filter[header.colname].options.indexOf(item[header.colname]) < 0) {
                this.filter[header.colname].options.push(item[header.colname]);
                this.filter[header.colname].selected.push(item[header.colname]);
              }
            });
          }
        });
      }
    }
    //Assigning date filtered values
    this.visibleItemlist = this.itemlist;
  }

  handleSort(header, value) {
    this.listSize = 100;
    const newValue = this.sort[header.colname] === value ? null : value;
    this.sort[header.colname] = newValue;

    if (header.isDate) {
      //if the data table was being use by conversation log
      if (this.usecaselist) {
        if (newValue === 'desc') {
          this.updateLogsSort.emit(-1);
        } else if (newValue === 'asc') {
          this.updateLogsSort.emit(+1);
        } else {
          if (this.usecaselist && value === 'desc') {
            this.updateLogsSort.emit(-1);
          } else if (this.usecaselist && value === 'asc') {
            this.updateLogsSort.emit(+1);
          }
        }
      } else {
        //data table was not being used by conversation logs
        if (newValue === 'desc') {
          this.itemlist = this.itemlist.sort((a, b) => {
            return new Date(b[header.colname]).getTime() - new Date(a[header.colname]).getTime();
          });
        } else if (newValue === 'asc') {
          this.itemlist = this.itemlist.sort((a, b) => {
            return new Date(a[header.colname]).getTime() - new Date(b[header.colname]).getTime();
          });
        }
        this.applyFilter();
      }
    } else if (header.type === 'text-decimal') {
      if (newValue === 'desc') {
        this.itemlist = this.itemlist.sort((a, b) => {
          return b[header.colname] - a[header.colname];
        });
      } else if (newValue === 'asc') {
        this.itemlist = this.itemlist.sort((a, b) => {
          return a[header.colname] - b[header.colname];
        });
      }
    }
  }

  onScroll(data) {
    if (this.usecaselist) {
      //if the data table was being use by conversation log
      if (data.target.scrollHeight - data.target.scrollTop < 800) {
        this.listSize += 100;
        this.visibleItemlist = this.itemlist.slice(0, this.listSize);
      }
    } else {
      //data table was not being used by conversation logs
      if (data.target.scrollHeight - data.target.scrollTop < 800) {
        this.listSize += 100;
        this.visibleItemlist = this.filteredItems.slice(0, this.listSize);
      }
    }
  }

  toggleFilterDropdown(column) {
    if (column && column.filterIntents) {
      this.openFilterBox = this.openFilterDropdown === column ? null : column;
    } else {
      this.openFilterDropdown = this.openFilterDropdown === column && column.colname ? null : column.colname;
    }

    if (this.toggleDropdown) {
      //close dropdown
      this.toggleDropdown = false;
      this.openFilterDropdown = null
    } else {
      //show dropdown
      this.toggleDropdown = true;
    }
  }

  isShowAllChecked(colname) {
    return this.filter[colname].selected.length === this.filter[colname].options.length;
  }

  toggleSelectAll(colname) {
    //if the data table was being use by conversation log
    if (this.usecaselist) {
      if (this.isShowAllChecked(colname)) {
        this.filter[colname].selected = [];
        this.logFilter = true;
        this.visibleItemlist = [];
        this.disablePageButtons.emit(true);
      } else {
        this.filter[colname].selected = JSON.parse(JSON.stringify(this.filter[colname].options));
        this.updateLogsFilter.emit(this.filter.useCaseName.options);
        this.disablePageButtons.emit(false);
      }
    } else {
      //data table was not being used by conversation logs
      if (this.isShowAllChecked(colname)) {
        this.filter[colname].selected = [];
      } else {
        this.filter[colname].selected = JSON.parse(JSON.stringify(this.filter[colname].options));
      }
      this.applyFilter();
    }
  }

  toggleFilterSelection(colname, value) {
    //if the data table was being use by conversation log
    if (this.usecaselist) {
      if (this.filter[colname].selected.indexOf(value) === -1) {
        this.filter[colname].selected.push(value);
        this.logFilter = true;
        this.updateLogsFilter.emit(this.filter.useCaseName.selected);
        this.disablePageButtons.emit(false);
      } else {
        const index = this.filter.useCaseName.selected.indexOf(value);
        this.filter.useCaseName.selected.splice(index, 1);
        if (this.filter.useCaseName.selected.length === 0) {
          this.visibleItemlist = [];
          this.disablePageButtons.emit(true);
        } else {
          this.logFilter = true;
          this.updateLogsFilter.emit(this.filter.useCaseName.selected);
          this.disablePageButtons.emit(false);
        }
      }
    } else {
      //data table was not being used by conversation logs
      if (this.filter[colname].selected.indexOf(value) === -1) {
        this.filter[colname].selected.push(value);
      } else {
        const index = this.filter[colname].selected.indexOf(value);
        this.filter[colname].selected.splice(index, 1);
      }
      this.applyFilter();
    }
  }

  applyFilter() {
    this.filteredItems = JSON.parse(JSON.stringify(this.itemlist));
    this.filteredItems = this.filteredItems.filter((item, index) => {
      let filterResult = true;
      this.itemheaders.forEach(header => {
        if (header.filter && this.filter[header.colname].selected.indexOf(item[header.colname]) === -1) {
          filterResult = false;
        }
      });
      return filterResult;
    });
    this.listSize = 100;
    this.visibleItemlist = this.filteredItems.slice(0, this.listSize);
  }

  handleDataRowClick(item, i, useCaseLogId) {
    this.clickEventEmitter.emit({ item, i, useCaseLogId });
  }

  handleCustomAction(action, data) {
    this.customAction.emit({ action, data });
  }
}
