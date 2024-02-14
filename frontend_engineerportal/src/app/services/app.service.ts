import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { ServiceAPIs } from '../core/services/service-apis.service';
import { Analytics } from '../model/analytics';
import { MasterBot } from 'src/app/model/master-bot';
/* 
import { DateFilter } from '../model/date-filter.interface';
import { Bot } from '../model/bot';
import { BotConfiguration } from '../model/bot-configuration';
import { UseCases } from '../model/use-cases';
import { ConversationLog } from '../model/conversation-log';
import { ConversationDetails } from '../model/conversation-details';
import { CustomerSatisfaction } from '../model/customer-satisfaction'; */

@Injectable()
export class AppService {

  constructor(
    private http: HttpClient,
    private serviceAPIs: ServiceAPIs) {
  }

  getUseCaseAnalytics(from: string, to: string, masterBotId?: string): Observable<Analytics> {
    let filter = 'from=' + from + '&' + 'to=' + to;
    filter = (masterBotId) ? filter + '&masterBotId=' + masterBotId : filter;
    const requestUrl = this.serviceAPIs.getApiUrl('USECASE_ANALYTICS') + '?' + filter;
    return this.http.get<Analytics>(requestUrl)
      .pipe(
        map((response: any) => {
          const analytics: Analytics = (new Analytics()).deserialize(response);
          return analytics;
        }),
    );
  }

  getIntentMatched(from: string, to: string, masterBotId?: string): Observable<any> {
    let filter = 'from=' + from + '&' + 'to=' + to;
    filter = (masterBotId) ? filter + '&masterBotId=' + masterBotId : filter;
    const requestUrl = this.serviceAPIs.getApiUrl('INTENT_MATCHED_ANALYTICS') + '?' + filter;
    return this.http.get<any>(requestUrl)
      .pipe(
        map((response: any) => {
          return response;
        }),
    );
  }


  getListBots(dateFilter, botID?: string): Observable<Array<MasterBot>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_BOTS');
    return this.http.get<Array<MasterBot>>(requestUrl)
      .pipe(
        map((response: any) => {
          const botsLst: Array<MasterBot> = [];
          if (response.length > 0) {
            response.forEach((value, index) => {
              botsLst.push((new MasterBot()).deserialize(value));
            });
          }
          return botsLst;
        }),

    );
  }
  
}
