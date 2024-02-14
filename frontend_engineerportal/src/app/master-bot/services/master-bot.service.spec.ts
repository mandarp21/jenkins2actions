/**
 * Test case for Ancillaries Service
 */
import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { MasterBotService } from './master-bot.service';
import { ServiceAPIs } from '../../core/services/service-apis.service';
import { UtilService } from 'src/app/services/util.service';
import { MasterBot } from 'src/app/model/master-bot';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


class GetServiceApi {
  public getApiUrl(path: string) {
    return 'dummyurl.com/' + path;
  }
  public getHttpParams({}) {

  }
  public getHttpHeaders(post) {

  }
}

class UtilMockService {
  getAdminFullName(){
    return "MockName"
  }
  getSessionStorage(botId){
  return JSON.stringify({"id":"mockId"})
  }
  sortArray(){
  return {}
  }
  }

const payload = {
  "masterBotName": "Edwin",
  "masterBotDescription": "CMT Customer Service Bot",
  "masterBotImage": "https://s3image",
  "masterBotDefaultAuthentication": "false",
  "NLPProvider": "watson",
  "NLPConfig": {
    "provider": "watson",
    "config": {
      "main_port": 234566,
      "password": "1234567890",
      "username": "1q2w3e4r5t6y7-1q2w-1q2w3e-1q2w3e-1q2w3e4r",
      "workspace_id": "zxcvbnm12-5t6y7u-8i9o0-7y6t5-tgyhuj876",
      "url": "https://gateway.watsonplatform.net/conversation/api"
    }
  },
  "STTProvider": "watson",
  "STTConfig": {
    "provider": "watson",
    "config": {
      "username": "1q2w3e4r5t6y7-1q2w-1q2w3e-1q2w3e-1q2w3e4r",
      "password": "1234567890",
      "version": "v1",
      "url": "https://stream.watsonplatform.net/speech-to-text/api",
      "customizationId": "1q2w3e4r5t6y7u8-1q2w3e4r5-1q2w3e4"
    }
  },
  "TTSProvider": "polly",
  "TTSConfig": {
    "provider": "polly",
    "config": {
      "accessKeyId": "12345678901234",
      "secretAccessKey": "hdjakhdjashdh186238612863jajsddsd",
      "region": "us-east-2"
    }
  },
  "createdBy": "linh.t.nguyen",
  "updatedBy": "linh.t.nguyen"
}

describe('MasterBotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        MasterBotService,
        {provide:UtilService,useClass:UtilMockService},
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


  it('service call post api for createWorkerBot', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={masterBotId:"mockID",masterBotName:"mockName",masterBotDescription:"mockDes",masterBotImage:"url",createdOn:"18-10-2019"}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(data);
    });
    masterBotService.createMasterBot(payload)
      .subscribe((response) => {
        expect(response.botId).toEqual(data.masterBotId);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('CREATE_MASTER_BOT');
  }));

  it('service call post api for updateMasterBot', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={masterBotId:"mockID",masterBotName:"mockName",masterBotDescription:"mockDes",masterBotImage:"url",createdOn:"18-10-2019"}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(data);
    });
    masterBotService.updateMasterBot(payload)
      .subscribe((response) => {
        expect(response.botId).toEqual(data.masterBotId);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('UPDATE_MASTER_BOT');
  }));

  it('service call post api for getMasterBot', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={masterBotId:"mockID",masterBotName:"mockName",masterBotDescription:"mockDes",masterBotImage:"url",createdOn:"18-10-2019"}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(data);
    });
    masterBotService.getMasterBot('id')
      .subscribe((response) => {
        expect(response.botId).toEqual(data.masterBotId);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('GET_MASTER_BOT');
  }));

  it('service call post api for listworkerbots', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={workerBotId:"mockID",workerBotName:"mockName",workerBotDescription:"mockDes",createdOn:"18-10-2019"}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond([data]);
    });
    masterBotService.listWorkerBots('id')
      .subscribe((response) => {
        expect(response[0].botId).toEqual(data.workerBotId);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('LIST_WORKER_BOTS');
  }));

  it('service call post api for deleteMasterBot', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={masterBotId:"mockID",masterBotName:"mockName",masterBotDescription:"mockDes",masterBotImage:"url",createdOn:"18-10-2019"}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond([data]);
    });
    masterBotService.deleteMasterBot('id')
      .subscribe((response) => {
        expect(response[0].masterBotId).toEqual(data.masterBotId);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('DELETE_MASTER_BOT');
  }));

  it('service call post api for listVariables', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={id:"mockID",masterBotId:"masterBotId",name:"mockZName",description:"mockDes",type:"url",config:{date:"18-10-2019"}}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond([data]);
    });
    masterBotService.listVariables()
      .subscribe((response) => {
        expect(response[0].id).toEqual(data.id);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('LIST_VARIABLES');
  }));

  it('service call post api for deleteApI variables', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={id:"mockID",masterBotId:"masterBotId",name:"mockZName",description:"mockDes",type:"url",config:{date:"18-10-2019"}}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond([data]);
    });
    masterBotService.deleteApiVariable("botid")
      .subscribe((response) => {
        expect(response[0].id).toEqual(data.id);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('DELETE_VARIABLE');
  }));

  it('service call post api for exportVariables', inject([ServiceAPIs, MasterBotService, MockBackend], (serviceAPIs: ServiceAPIs, masterBotService: MasterBotService, mockBackend: MockBackend) => {
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let data={id:"mockID",masterBotId:"masterBotId",name:"mockZName",description:"mockDes",type:"url",config:{date:"18-10-2019"}}
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond([data]);
    });
    masterBotService.exportVariables()
      .subscribe((response) => {
        expect(response[0].id).toEqual(data.id);
      });
    expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('EXPORT_VARIABLES');
  }));
  
});
