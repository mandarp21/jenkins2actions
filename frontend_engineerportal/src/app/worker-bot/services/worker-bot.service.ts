import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, catchError } from 'rxjs/operators';

import { ServiceAPIs } from '../../core/services/service-apis.service';
import { WorkerBot } from '../../model/worker-bot';
import { MasterBot } from '../../model/master-bot';
import { Intent } from '../../model/intent';
import { IUseCases, UseCases, IGetUseCases } from '../../model/use-cases';
import { ConversationLog } from '../../model/conversation-log';
import { ConversationDetails } from '../../model/conversation-details';
import { DropDownOption } from '../../model/dropdown-option.model';

@Injectable()
export class WorkerBotService {
  private intentListOptions = new BehaviorSubject<Array<DropDownOption>>([]);
  private entityListOptions = new BehaviorSubject<Array<DropDownOption>>([]);
  private entityListValues = new BehaviorSubject<any>([]);
  private workerBot: BehaviorSubject<WorkerBot> = new BehaviorSubject<WorkerBot>(new WorkerBot());

  public workerBot$: Observable<WorkerBot> = this.workerBot.asObservable();
  intentListOptionObs = this.intentListOptions.asObservable();
  entityListOptionObs = this.entityListOptions.asObservable();
  entityListValuesObs = this.entityListValues.asObservable();

  constructor(private http: HttpClient, private serviceAPIs: ServiceAPIs) {}

  publishWorkerBot(workerBot: WorkerBot) {
    this.workerBot.next(workerBot);
  }

  createWorkerBot(payload: any): Observable<WorkerBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('CREATE_WORKER_BOT');
    return this.http.post<WorkerBot>(requestUrl, payload).pipe(
      map((response: any) => {
        return new WorkerBot().deserialize(response);
      })
    );
  }

  updateWorkerBot(payload: any): Observable<WorkerBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('UPDATE_WORKER_BOT');
    return this.http.put<WorkerBot>(requestUrl, payload).pipe(
      map((response: any) => {
        return new WorkerBot().deserialize(response);
      })
    );
  }

  /**
   * @description Sets the Intent in the intentListOptions objects
   * @param data - Array of DropDownOption containing Intents
   */
  setIntentListOption(data: DropDownOption[]) {
    this.intentListOptions.next(data);
  }

  /**
   * @description Sets the Entity in the entityListOptions objects
   * @param data - Array of DropDownOption containing Entities
   */
  setEntityListOption(data: DropDownOption[]) {
    this.entityListOptions.next(data);
  }

  /**
   * @description Sets the entity values in the entityListValues object
   * @param data - object containing entity values
   */
  setEntityListValues(data: any) {
    this.entityListValues.next(data);
  }

  getWorkerBot(botID: string): Observable<WorkerBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('GET_WORKER_BOT') + '/' + botID;
    return this.http.get<WorkerBot>(requestUrl).pipe(
      map((response: any) => {
        return new WorkerBot().deserialize(response);
      })
    );
  }

  getMasterBot(botID: string): Observable<MasterBot> {
    const requestUrl = this.serviceAPIs.getApiUrl('GET_MASTER_BOT') + '/' + botID;
    return this.http.get<MasterBot>(requestUrl).pipe(
      map((response: any) => {
        return new MasterBot().deserialize(response);
      })
    );
  }

  getListUseCases(botID: string): Observable<Array<UseCases>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_USE_CASES') + '/' + botID;
    return this.http.get<Array<UseCases>>(requestUrl).pipe(
      map((response: any) => {
        const botsLst: Array<UseCases> = [];
        if (response.length > 0) {
          response.forEach((value, index) => {
            botsLst.push(new UseCases().deserialize(value));
          });
        }
        return botsLst;
      })
    );
  }

  getListIntents(botID: string): Observable<Array<Intent>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_INTENTS') + '?workerBotId=' + botID;
    return this.http.get<Array<Intent>>(requestUrl).pipe(
      map((response: any) => {
        const intents: Array<Intent> = [];

        if (response.intents.length > 0) {
          response.intents.forEach((value, index) => {
            intents.push(new Intent().deserialize(value));
          });
        }
        return intents;
      })
    );
  }

  postUseCases(payload: Array<IUseCases>): Observable<UseCases> {
    const requestUrl = this.serviceAPIs.getApiUrl('CREATE_USE_CASE');
    return this.http.post<Array<UseCases>>(requestUrl, payload).pipe(
      map((response: any) => {
        return new UseCases().deserialize(response);
      })
    );
  }

  updateUseCases(payload: IGetUseCases): Observable<UseCases> {
    const requestUrl = this.serviceAPIs.getApiUrl('UPDATE_USE_CASE');
    return this.http.put<IGetUseCases>(requestUrl, payload).pipe(
      map((response: any) => {
        return new UseCases().deserialize(response);
      })
    );
  }

  /**
   * @description Http call to delete the usecase
   * @param { string } useCaseId usecase id to delete
   */
  deleteUseCases(useCaseId: string): Observable<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('DELETE_USE_CASE') + '/' + useCaseId;
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
   * @description Http call to delete the WorkerBot
   * @param { string } workerBotId - workerbot id to delete
   */
  deleteWorkerBot(workerBotId: string): Observable<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('DELETE_WORKER_BOT') + '/' + workerBotId;
    return this.http.delete(requestUrl).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getConversationDetails(sessionId?: string, botId?: string): Observable<Array<ConversationDetails>> {
    const requestUrl = this.serviceAPIs.getApiUrl('CONVERSATION_DETAILS') + '?sessionId=' + sessionId + '&workerBotId=' + botId;
    return this.http.get<Array<ConversationDetails>>(requestUrl).pipe(
      map((response: any) => {
        const conversationDetailsData: Array<ConversationDetails> = [];
        if (response.conversationLog.length > 0) {
          response.conversationLog.forEach(value => {
            conversationDetailsData.push(new ConversationDetails().deserialize(value));
          });
        }
        return conversationDetailsData;
      })
    );
  }

  getConversationLog(botId: any, toDate: any, fromDate: any, skipValue:number, logUpdate: any, sortValue: number = -1, limitValue:number): Observable<Array<ConversationLog>> {
    const requestUrl = this.serviceAPIs.getApiUrl('CONVERSATION_LOG') + '?workerBotId=' + botId + '&from=' + fromDate + '&to=' + toDate + '&skip=' + skipValue + '&useCaseFilter=' +  logUpdate + '&sort=' + sortValue + '&limit=' + limitValue;
    return this.http.get<Array<ConversationLog>>(requestUrl).pipe(
      map((response: any) => {
        const conversationLogData: Array<ConversationLog> = [];
        if (response.useCases.length > 0) {
          response.useCases.forEach(value => {
            conversationLogData.push(new ConversationLog().deserialize(value));
          });
        }
        return conversationLogData;
      })
    );
  }

  /**
   * @description http request to get list of conversation associated with usecase
   * @return {Observable<any>} - observable response
   */
  listConversationFlows(useCaseID: string): Observable<Array<any>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_CONVERSATION_FLOW') + '/' + useCaseID;
    return this.http.get<Array<any>>(requestUrl).pipe(
      map((flows: any) => {
        return flows;
      })
    );
  }

  /**
   * @description Http call to get the list of Intents
   * @param { string } workerBotId usecase id to get Intents
   * @return { DropDownOption } - Array of DropDownOption containing Intents
   */
  getIntentList(workerBotId: string): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_INTENTS') + '?workerBotId=' + workerBotId;
    return this.http
      .get(requestUrl)
      .toPromise()
      .then(response => {
        return new DropDownOption().deserialize(response['intents']);
      })
      .catch(error => console.log(error));
  }

  /**
   * @description Http call to get the list of Entity
   * @param { string } workerBotId usecase id to get Entities
   * @return { DropDownOption } - Array of DropDownOption containing Entities
   */
  getEntityList(workerBotId: string): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_ENTITIES') + '?workerBotId=' + workerBotId;
    return this.http
      .get(requestUrl)
      .toPromise()
      .then(response => {
        const entityValues = {};
        response['entities'].forEach(item => (entityValues[item.entityName] = new DropDownOption().deserialize(item.entityValues)));
        return {
          entityOptions: new DropDownOption().deserialize(response['entities'].map(item => item.entityName)),
          entityValues: entityValues
        };
      })
      .catch(error => console.log(error));
  }

  /**
   * @description Http call to get the NLC Logs
   * @param { string } workerBotId usecase id to get Entities
   * @return { any } - Array of DropDownOption containing Entities
   */
  getNLCLogs(workerBotId: string): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('NLC_LOGS') + '?workerBotId=' + workerBotId;
    return this.http
      .get(requestUrl)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => console.log(error));
  }

  /**
   * @description Http call to add Utterance
   * @param { any } payload request body containing required params
   * @return { any } - Comfirmation of adding Utterance
   */
  addUtternace(payload: any): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('ADD_UTTERANCE');
    return this.http
      .post(requestUrl, payload)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * @description Http call to Reclasiffy Utterance
   * @param { any } payload request body containing required params
   * @return { any } - Comfirmation of reclassifying Utterance
   */
  reclassifyUtternace(payload: any): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('RECLASSIFY_UTTERANCE');
    return this.http
      .post(requestUrl, payload)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * @description Http call to get NPL conversation details
   * @return {Observable<ConversationDetails>} - observable response
   */

  getNplConversationDetails(sessionId?): Observable<Array<ConversationDetails>> {
    const requestUrl = this.serviceAPIs.getApiUrl('CONVERSATION_DETAILS') + '?sessionId=' + sessionId;
    return this.http.get<Array<ConversationDetails>>(requestUrl).pipe(
      map((response: any) => {
        const conversationDetailsData: Array<ConversationDetails> = [];
        if (response.conversationLog.length > 0) {
          response.conversationLog.forEach(value => {
            conversationDetailsData.push(new ConversationDetails().deserialize(value));
          });
        }
        return conversationDetailsData;
      })
    );
  }
}
