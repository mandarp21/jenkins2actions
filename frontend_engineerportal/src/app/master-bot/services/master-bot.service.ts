import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ServiceAPIs } from '../../core/services/service-apis.service';
import { MasterBot } from '../../model/master-bot';
import { WorkerBot } from '../../model/worker-bot';
import { Variable } from '../../bot-builder/model/variable.model';
import { UtilService } from 'src/app/services/util.service';

@Injectable()
export class MasterBotService {
  constructor(private http: HttpClient, private serviceAPIs: ServiceAPIs, private utilService: UtilService) {}

  createMasterBot(payload: any): Observable<MasterBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('CREATE_MASTER_BOT');
    return this.http.post<MasterBot>(requestUrl, payload).pipe(
      map((response: any) => {
        return new MasterBot().deserialize(response);
      })
    );
  }

  updateMasterBot(payload: any): Observable<MasterBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('UPDATE_MASTER_BOT');
    return this.http.put<MasterBot>(requestUrl, payload).pipe(
      map((response: any) => {
        return new MasterBot().deserialize(response);
      })
    );
  }

  getMasterBot(botId: string): Observable<MasterBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('GET_MASTER_BOT') + '/' + botId;
    return this.http.get<MasterBot>(requestUrl).pipe(
      map((response: any) => {
        return new MasterBot().deserialize(response);
      })
    );
  }

  listWorkerBots(botID: string): Observable<Array<WorkerBot>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_WORKER_BOTS') + '/' + botID;
    return this.http.get<Array<WorkerBot>>(requestUrl).pipe(
      map((response: any) => {
        const botsLst: Array<WorkerBot> = [];
        if (response.length > 0) {
          response.forEach((value, index) => {
            botsLst.push(new WorkerBot().deserialize(value));
          });
        }
        return botsLst;
      })
    );
  }

  /**
   * @description Http call to delete the masterBot
   * @param { string } masterBotId - masterBotId to delete
   */
  deleteMasterBot(masterBotId: string): Observable<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('DELETE_MASTER_BOT') + '/' + masterBotId;
    return this.http.delete(requestUrl).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * @description Http call to get the list of Variables
   * @return { Variable } - Array of Variables
   */
  listVariables(): Observable<Array<Variable>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_VARIABLES') + '/' + JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
    return this.http.get<Array<Variable>>(requestUrl).pipe(
      map((response: any) => {
        const variables: Array<Variable> = [];
        if (response.length) {
          response.forEach(data => {
            variables.push(new Variable().deserialize(data));
          });
        }
        return variables;
      })
    );
  }

  /**
   * @description Http call to delete the Api Variable
   * @param { string } apiId - apiId to delete
   */
  deleteApiVariable(apiId: string): Observable<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('DELETE_VARIABLE') + '/' + apiId;
    return this.http.delete(requestUrl).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * @description To fetch the variables for the Master Bot
   * @return { Variable } - Array of Variables
   */
  exportVariables(): Observable<Array<Variable>> {
    const requestUrl = this.serviceAPIs.getApiUrl('EXPORT_VARIABLES') + '/' + JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
    return this.http.get<Array<Variable>>(requestUrl).pipe(
      map((response: any) => {
        if (response.length) {
          return response;
        }
      })
    );
  }
}
