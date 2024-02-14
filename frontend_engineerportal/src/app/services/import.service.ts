import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { ServiceAPIs } from '../core/services/service-apis.service';
import { throwError } from 'rxjs';

/**
 * @description service for importing the selected entity
 */
@Injectable()
export class ImportService {
  constructor(
    private http: HttpClient,
    private serviceAPIs: ServiceAPIs) {
  }
  /**
   * @method importAndSave
   * @description import the selected entity and make API call to save data to DB
   */
  importAndSave(apiIdentifier: string, fileToUpload: string, botId: string) {
    if(fileToUpload) {
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload['name']);
      const requestUrl = this.serviceAPIs.getApiUrl(apiIdentifier) + '/' + botId;
      return this.http.post(requestUrl, formData)
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
}
