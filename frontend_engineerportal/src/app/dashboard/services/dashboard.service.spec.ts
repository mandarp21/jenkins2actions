/**
 * Test case for Ancillaries Service
 */
import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { DashboardService } from './dashboard.service';
import { ServiceAPIs } from '../../core/services/service-apis.service';

class GetServiceApi {
  public getApiUrl(path: string) {
    return 'dummyurl.com/' + path;
  }
  public getHttpParams({}) {

  }
  public getHttpHeaders(post) {

  }
}

const mockResponse = [
  {
      "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
      "botName": "TestTEst",
      "botDescription": "CMT Customer Service Bot",
      "botImage": "https://s3image",
      "masterBotStatus": "active",
      "createdBy": "sample.user",
      "updatedBy": "sample.user",
      "createdOn": "1531211009000",
      "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  },
  {
    "botId": "f2f246f0-9b2e-43af-b78a-5e2d602c78d2",
    "botName": "TestTEst",
    "botDescription": "CMT Customer Service Bot",
    "botImage": "https://s3image",
    "masterBotStatus": "active",
    "createdBy": "sample.user",
    "updatedBy": "sample.user",
    "createdOn": "1531211009000",
    "updatedOn": "1531211009000"
  }
];


const botID = 'f2f246f0-9b2e-43af-b78a-5e2d602c78d2';

describe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        DashboardService,
        { provide: ServiceAPIs, useClass: GetServiceApi },
        {
          deps: [
            MockBackend,
            BaseRequestOptions,
          ],
          provide: HttpClient,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
        },
      ],
    });
  });


  it('service call get api for List master bots', inject([ServiceAPIs, DashboardService, MockBackend], (serviceAPIs: ServiceAPIs, dashboardService: DashboardService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(mockResponse);
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let botList = null;
    dashboardService.listMasterBot(botID).subscribe((response) => {
      botList = response;
    });
    expect(botList).not.toEqual(null);
    expect(botList.length).toEqual(mockResponse.length);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('LIST_BOTS');
  }));

});