import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceAPIs } from '../../core/services/service-apis.service';
import { MasterBot } from '../../model/master-bot';
import { Analytics } from '../../model/analytics';

@Injectable()
export class DashboardService {

  constructor(
    private http: HttpClient,
    private serviceAPIs: ServiceAPIs) {
  }

  listMasterBot(adminUserId: string): Observable<Array<MasterBot>> {
    adminUserId = adminUserId || '123';
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_BOTS') + '/' + adminUserId;
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

