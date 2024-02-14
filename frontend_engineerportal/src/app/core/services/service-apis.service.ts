import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ENVIROMENTS, API_ENV_BASE_URLS, API_URLS, MOCK_API_URLS, API_PORTS } from '../../config';

@Injectable()
export class ServiceAPIs {
  private _env: string;
  private _baseURL: string;
  constructor() {
    this._env = environment.MODE;
    this._baseURL = API_ENV_BASE_URLS[this._env];
  }

  getApiUrl(action: string): string {
    let apiUrl: string;
    if (ENVIROMENTS.MOCK === this._env) {
      // if it is mock - really this is when deployed
      apiUrl = MOCK_API_URLS[action];
    } else if (ENVIROMENTS.LOCAL === this._env) {
      // if backend services are running locally
      const urlParts = API_URLS[action].split('/');
      this._baseURL = API_ENV_BASE_URLS[this._env] + ':' + API_PORTS[urlParts.shift()];
      apiUrl = this._baseURL + '/' + urlParts.join('/');
    } else {
      //for local development when using deployed backend services
      this._baseURL = API_ENV_BASE_URLS[this._env];
      const urlparam = API_URLS[action].split('/');
      if (urlparam.length !== 3) {
        const urlPart = API_URLS[action].split('/').pop();
        apiUrl = this._baseURL + '/' + urlPart;
      } else {
        const urlPart = urlparam.splice(1).join('/');
        apiUrl = this._baseURL + '/' + urlPart;
      }
    }
    return apiUrl;
  }

  getWSAPIUrl(action): string {
    let apiUrl: string;    
    if (ENVIROMENTS.MOCK === this._env) {
      // if it is mock - really this is when deployed
      // this._baseURL = MOCK_API_URLS[this._env];
      apiUrl = '/' + MOCK_API_URLS[action];
    } else if (ENVIROMENTS.LOCAL === this._env) {
      // if backend services are running locally
      this._baseURL = API_ENV_BASE_URLS[this._env] + ':' + API_PORTS['backend-channeladapter-engineerportal'];      
      apiUrl = this._baseURL + '/' + API_URLS[action];
    } else {
      // for local development when using deployed backend services
      this._baseURL = API_ENV_BASE_URLS[this._env];
      apiUrl = this._baseURL + '/' + API_URLS[action];     
    }

    return apiUrl;
  }

  getUrlPath(action): string {    
    if (ENVIROMENTS.LOCAL === this._env) {
      const urlParts = API_URLS[action].split('/');
      urlParts.shift();    
      return '/' + urlParts.join('/');
    
    } else return '/' + API_URLS[action];
  }

  getHttpHeaders(method?: string): HttpHeaders {
    let headers: HttpHeaders;
    switch (method.toLowerCase()) {
      case 'post':
        headers = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
        break;
      case 'put':
        headers = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
        break;
    }
    return headers;
  }

  getHttpParams(payload: any): HttpParams {
    let httpParams: HttpParams = new HttpParams(payload);
    Object.keys(JSON.parse(JSON.stringify(payload))).forEach(function(key) {
      if (typeof payload[key] === 'object') {
        httpParams = httpParams.append(key, JSON.stringify(payload[key]));
      } else {
        httpParams = httpParams.append(key, payload[key]);
      }
    });
    return httpParams;
  }
}
