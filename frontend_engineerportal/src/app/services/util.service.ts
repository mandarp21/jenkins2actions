import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { DateFilter } from '../model/date-filter.interface';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

@Injectable()
export class UtilService {
  private dateFilter: Subject<DateFilter> = new Subject<DateFilter>();
  public dateFilter$: Observable<DateFilter> = this.dateFilter.asObservable();
  private masterBot: Subject<string> = new Subject<string>();
  public masterBot$: Observable<string> = this.masterBot.asObservable();
  public message: string;

  constructor(private cookieService: CookieService) { }

  publishDateFilter(filter: DateFilter) {
    this.dateFilter.next(filter);
  }

  publishMasterBot(masterBotId: string) {
    this.masterBot.next(masterBotId);
  }

  sortArray(itemlist: any, colName: string, order: string): Array<any> {
    let data = Array.from(itemlist);
    let columnName: string = colName;
    let sort: string = order;
    let preValLowerCase: any = '';
    let currValLowerCase: any = '';

    if (!columnName) {
      return data;
    }

    data.sort((previous: any, current: any) => {
      const preVal = ((columnName).toLowerCase() === 'lastmodified') ? +moment(previous[columnName], 'DD-MMM-YYYY HH:mm:ss').format('YYYYMMDDHHmmss') : previous[columnName];
      const currVal = ((columnName).toLowerCase() === 'lastmodified') ? +moment(current[columnName], 'DD-MMM-YYYY HH:mm:ss').format('YYYYMMDDHHmmss') : current[columnName];
      if (typeof (preVal && currVal) === 'boolean'|| typeof (preVal && currVal) === 'number') {
        preValLowerCase = preVal;
        currValLowerCase = currVal;
      } else if ((columnName === 'customerSatisfaction') || (columnName ==='intentsMatched') || (columnName ==='automation') || (columnName ==='escalation')) {
        preValLowerCase = parseFloat(preVal);
        currValLowerCase = parseFloat(currVal);
        if(isNaN(preValLowerCase)) {  //Fix for N/A values
          return sort === 'desc' ? -1 : 1;
        }
        if(isNaN(currValLowerCase)) {  //Fix for N/A values
          return sort === 'asc' ? -1 : 1;
        }
      }
      else {
        preValLowerCase = preVal.toLowerCase(); // added for case sensitive sorting issue fix
        currValLowerCase = currVal.toLowerCase(); // added for case sensitive sorting issue fix
      }

      if (preValLowerCase > currValLowerCase) {
        return sort === 'desc' ? -1 : 1;
      } else if (preValLowerCase < currValLowerCase) {
        return sort === 'asc' ? -1 : 1;
      }
    return 0;
    });
    return data;
  }

  /**
   * @description - To get the session storage key value
   * @param {string} key - containing the name of the key you want to get.
   * @return {void | null} - containing the value of the key. If the key does not exist, null is returned.
   */
  getSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  /**
   * @description - To set the session storage key
   * @param {string} key - containing the name of the key you want to set.
   * @param {any} value - containing the value you want to set.
   * @return {void}
   */
  setSessionStorage(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @description - To delete the session storage key
   * @param {string} key - containing the name of the key you want to remove.
   * @return {Void}
   */
  deleteSessionStorage(key: string): void {
    return sessionStorage.removeItem(key);
  }

  /**
   * @description - To return the admin first name
   * @return {string}
   */
  getAdminFirstName(): string {
    return this.cookieService.get('adminFirstName');
  }

  /**
   * @description - To return the admin last name
   * @return {string}
   */
  getAdminLastName(): string {
    return this.cookieService.get('adminLastName');
  }

  /**
   * @description - To return the admin full name
   * @return {string}
   */
  getAdminFullName(): string {
    return this.cookieService.get('adminFirstName') + ' ' + this.cookieService.get('adminLastName');
  }

  /**
   * @description - To return the admin id
   * @return {string}
   */
  getAdminId(): string {
    return this.cookieService.get('adminId');
  }

  /**
   * @description - To delete the authentication cookies
   * @return {string}
   */
  deleteAuthCookies(): void {
    console.log("======== In Delete Cookies ======");
    document.cookie = 'adminToken=';
    this.cookieService.delete('adminToken');
    this.cookieService.delete('adminFirstName');
    this.cookieService.delete('adminLastName');
    this.cookieService.delete('adminId');
  }

  /**
   * @description - To return the authentication token
   * @return {string}
   */
  getAuthToken(): string {
    return this.cookieService.get('adminToken');
  }
}
