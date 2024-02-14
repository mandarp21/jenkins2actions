import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { ServiceAPIs } from '../core/services/service-apis.service';
import { throwError } from 'rxjs';
import { UseCases } from '../model/use-cases';

/**
 * @description service for exporting the use cases and other utility functions
 */
@Injectable()
export class ExportService {
  constructor(
    private http: HttpClient,
    private serviceAPIs: ServiceAPIs) {
  }
  /**
   * @method exportAndDownload
   * @description get the use case data for zip download
   */
  exportAndDownload(apiIdentifier: string, payload: Object) {
    if(payload) {
      const headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/zip',
      });
      const requestUrl = this.serviceAPIs.getApiUrl(apiIdentifier);
      return this.http.post(requestUrl, payload, {headers, responseType : 'blob', observe: 'response'})
        .pipe(
          map((response: any) => {
            return response;
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        );
    }
  }

  /**
   * @method getUseCaseIds
   * @description resolve the use case data to fetch the use case Ids
   */
  getUseCaseIds(useCases: Array<UseCases>): Array<string> {
    // remoove the Default usecases from the Export
    const defaultUsecaseNames = ["greetings", "chitchat", "escalation", "disambiguation", "feedback", "incomprehension"];
    return useCases.filter(element => defaultUsecaseNames.indexOf(element['useCaseName']) === -1).map(element => element['useCaseId'] )
  }

  /**
   * @method getFileName
   * @description resolve the file name from the response headers
   */
  getFileName(contentDisposition: any){
  return contentDisposition.split(';')[1].split('=')[1].replace(/['"]+/g, '');
  }
}
