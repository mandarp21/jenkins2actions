/**
 * Test case for Ancillaries Service
 */
import { inject, TestBed, async } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { WorkerBotService } from './worker-bot.service';
import { ServiceAPIs } from '../../core/services/service-apis.service';
import { url } from 'inspector';
import { IGetUseCases } from 'src/app/model/use-cases';
import { WorkerBot } from 'src/app/model/worker-bot';
import { of } from 'rxjs';

class GetServiceApi {
  public getApiUrl(path: string, env: string) {
    if (env === 'dev') {
      return 'dummyurl.com/' + path;
    }
  }
}

const masterBot={
  masterBotId:"mockId",
  associatedIntents: ["mock1","mock2","mock3"],
  associatedEntities: ["mock1","mock2","mock3"],
  customerSatisfaction: "good",
  escalation:"mock",
  intentsMatched: "yes",
  automation: "mock",
  barChartData:[]
}

const request= [
  {
    useCaseId: 'a6438b79-fd21-4879-b86c-daf8d7c21664',
    useCaseName: 'Account Balance',
    useCaseDescription: 'This is mock desc',
    createdBy:"MOCK",
    updatedBy: 'Francis',
    averageHumanHandlingTime: '10',
    useCaseStatus: 'active',
    collectFeedback: true,
    entryIntents: ['AccountBalance'],
    entryEntities: ['user', 'action']
  }
];

const mockResponse = {
  channels: 'mockChannels',
  createdBy: 'Mocked',
  createdOn: 'Invalid date',
  updatedBy: 'Mocked',
  updatedOn: 'Invalid date',
  useCaseDescription: 'Mocked',
  useCaseId: 'a6438b79-fd21-4879-b86c-daf8d7c21664',
  useCaseName: 'mock greeting',
  useCaseStatus: 'active'
};

const mockGetResponse = [
  {
    channels: undefined,
    useCaseId: 'a6438b79-fd21-4879-b86c-daf8d7c21664',
    useCaseName: 'greeting',
    useCaseDescription: 'This is the standard use case to greet the user',
    useCaseStatus: 'active',
    createdBy: 'linh.t.nguyen',
    updatedBy: 'linh.t.nguyen',
    createdOn: 'Invalid date',
    updatedOn: 'Invalid date'
  },
  {
    channels: undefined,
    useCaseId: 'afb1c9fc-bf1d-437c-9be5-342760afb785',
    useCaseName: 'incomprehension',
    useCaseDescription: 'When the user message cannot be understood properly',
    useCaseStatus: 'active',
    createdBy: 'linh.t.nguyen',
    updatedBy: 'linh.t.nguyen',
    createdOn: 'Invalid date',
    updatedOn: 'Invalid date'
  },
  {
    channels: undefined,
    createdBy: 'linh.t.nguyen',
    createdOn: 'Invalid date',
    updatedBy: 'Chloe',
    updatedOn: 'Invalid date',
    useCaseDescription: 'This is the standard use case to greet the user',
    useCaseId: '1b2f1329-af2d-4485-983f-526c941c0144',
    useCaseName: 'greeting Edited',
    useCaseStatus: 'active'
  }
];

const mockMasterBotResponse = {
  botDescription: undefined,
  botId: undefined,
  botImage: undefined,
  botName: undefined,
  conversationComplete: '22',
  createdBy: 'mocked',
  createdOn: 'Invalid date',
  customerSatisfaction: '4.45',
  escalated: '42',
  intentsMatched: '0',
  lastModified: 'Invalid date',
  updatedBy: 'mocked'
};

const payload = {
  masterBotName: 'Edwin',
  masterBotDescription: 'CMT Customer Service Bot',
  masterBotImage: 'https://s3image',
  masterBotDefaultAuthentication: 'false',
  NLPProvider: 'watson',
  NLPConfig: {
    provider: 'watson',
    config: {
      main_port: 234566,
      password: '1234567890',
      username: '1q2w3e4r5t6y7-1q2w-1q2w3e-1q2w3e-1q2w3e4r',
      workspace_id: 'zxcvbnm12-5t6y7u-8i9o0-7y6t5-tgyhuj876',
      url: 'https://gateway.watsonplatform.net/conversation/api'
    }
  },
  STTProvider: 'watson',
  STTConfig: {
    provider: 'watson',
    config: {
      username: '1q2w3e4r5t6y7-1q2w-1q2w3e-1q2w3e-1q2w3e4r',
      password: '1234567890',
      version: 'v1',
      url: 'https://stream.watsonplatform.net/speech-to-text/api',
      customizationId: '1q2w3e4r5t6y7u8-1q2w3e4r5-1q2w3e4'
    }
  },
  TTSProvider: 'polly',
  TTSConfig: {
    provider: 'polly',
    config: {
      accessKeyId: '12345678901234',
      secretAccessKey: 'hdjakhdjashdh186238612863jajsddsd',
      region: 'us-east-2'
    }
  },
  createdBy: 'linh.t.nguyen',
  updatedBy: 'linh.t.nguyen'
};

describe('WorkerBotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        { provide: ServiceAPIs, useClass: GetServiceApi },
        WorkerBotService,
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: HttpClient,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });
  });

  it('service call post api for publishWorkerBot', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,backend:MockBackend) => {
      workerBotService.setIntentListOption([]);
      workerBotService.setEntityListOption([]);
      workerBotService.setEntityListValues("mockId");
      backend.connections.subscribe(response=>{
        response.mockRespond(masterBot)
      })
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let payload = new WorkerBot().mapFromApi(masterBot)
      workerBotService.publishWorkerBot(payload);
      workerBotService.workerBot$.subscribe(response=>{
      // expect(response.botId).toEqual(masterBot.masterBotId);
      })
    }
  ));
  
  it('service call post api for createWorkerBot', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, backend:MockBackend) => {
      backend.connections.subscribe(response=>{
        response.mockRespond(masterBot)
      })
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.createWorkerBot(masterBot).subscribe(response=>{
        // expect(response.masterBotId).toEqual(masterBot.masterBotId)
      });
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('CREATE_WORKER_BOT');
    }
  ));

  it('service call post api for updateWorkerBot', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, backend:MockBackend) => {
      backend.connections.subscribe(response=>{
        response.mockRespond(masterBot)
      })
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.updateWorkerBot(masterBot).subscribe(response=>{
// expect(response.masterBotId).toEqual(masterBot.masterBotId);
      });
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('UPDATE_WORKER_BOT');
    }
  ));

  it('service call post api for getWorkerBot', inject(
    [ServiceAPIs, WorkerBotService, MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(mockMasterBotResponse);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let getResponse = null;
      workerBotService.getWorkerBot('mockid').subscribe(response => {
        getResponse = response;
      });
      expect(getResponse.intentsMatched).toEqual(mockMasterBotResponse.intentsMatched);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('GET_WORKER_BOT');
    }
  ));

  it('service call post api for getMasterBot', inject(
    [ServiceAPIs, WorkerBotService, MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(mockMasterBotResponse);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let getResponse = null;
      workerBotService.getMasterBot('mockid').subscribe(response => {
        getResponse = response;
      });
      expect(getResponse.intentsMatched).toEqual(mockMasterBotResponse.intentsMatched);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('GET_MASTER_BOT');
    }
  ));

  it('service call post api for getListUseCases', inject(
    [ServiceAPIs, WorkerBotService, MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(mockGetResponse);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let getResponse = null;
      workerBotService.getListUseCases("a6438b79-fd21-4879-b86c-daf8d7c21664").subscribe(response => {
        getResponse = response;
      });
      // expect(getResponse[0].useCaseName).toEqual(mockGetResponse[0].useCaseName);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('LIST_USE_CASES');
    }
  ));

  it('service call post api for postUseCases', inject(
    [ServiceAPIs, WorkerBotService, MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(mockResponse);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let postResponse = null;
      workerBotService.postUseCases(request).subscribe(response => {
        postResponse = response;
      });
      // expect(postResponse.useCaseId).toEqual(mockResponse.useCaseId);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('CREATE_USE_CASE');
    }
  ));
  it('service call post api for updateUseCases', inject(
    [ServiceAPIs, WorkerBotService, MockBackend],
    (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(mockResponse);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      let updateResponse = null;
      const requestForUpdate=
      {
          useCaseId: 'a6438b79-fd21-4879-b86c-daf8d7c21664',
          useCaseName: 'Account Balance',
          useCaseDescription: 'This is mock desc',
          createdBy:"MOCK",
          updatedBy: 'Francis',
          averageHumanHandlingTime: '10',
          useCaseStatus: 'active',
          collectFeedback: true,
          entryIntents: ['AccountBalance'],
          entryEntities: ['user', 'action']
      }
     
      workerBotService.updateUseCases(requestForUpdate).subscribe(response => {
      updateResponse = response;
      });
      // expect(updateResponse.useCaseName).toEqual(mockResponse.useCaseName);
      expect(serviceAPIs.getApiUrl).toHaveBeenCalledWith('UPDATE_USE_CASE');
    }
  ));

  it('service call post api for getListIntents', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond({  intentName:"mockName",
          selected:false,intents:[{ intentName:"mock1",selected: false},{ intentName:"mock2",selected: false}]});
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
         workerBotService.getListIntents("mockInput").subscribe(response=>{
        // expect(response[0].intentName).toEqual("mockName");
      });
    }
  ));

  it('service call post api for deleteUseCases', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond([{result:"success"},{result2:"success"}]);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.deleteUseCases("mockInput").subscribe(response=>{
        // expect(response.result).toEqual("success");
      });
    }
  ));

  it('service call post api for deleteWorkerBot', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond([{result:"success"}]);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.deleteWorkerBot("mockInput").subscribe(response=>{
        // expect(response.result).toEqual("success");
      });
    }
  ));

  it('service call post api for getConversationDetails', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond({timestamp:"10",
          userMessage: "hi",
          response:[],conversationLog:[{timestamp:"10",
          userMessage: "hi",
          response:[]}]});
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.getConversationDetails("mockID","mockBotID").subscribe(response=>{
        // expect(response[0].userMessage).toEqual("hi");
      });
    }
 ));

 it('service call post api for getConversationLog', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond({ sessionId: "mockId",
        userId:"mockUser",
        useCaseName:"mockName",
        useCaseStatus: "true",
        startTimestamp: "10",
        channel:"skype",
        useCaseLogId:"20",useCases:[{ sessionId: "mockId",
        userId:"mockUser",
        useCaseName:"mockName",
        useCaseStatus: "true",
        startTimestamp: "10",
        channel:"skype",
        useCaseLogId:"20"},{ sessionId: "mockId",
        userId:"mockUser",
        useCaseName:"mockName",
        useCaseStatus: "true",
        startTimestamp: "10",
        channel:"skype",
        useCaseLogId:"20"}]
      });
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    workerBotService.getConversationLog("mockId","12-10-2019","11-10-2019",10,"true",10,20).subscribe(response=>{
      // expect(response[0].useCaseName).toEqual("mockName");
    });
  }))

  it('service call post api for  listConversationFlows', inject(
    [ServiceAPIs, WorkerBotService,MockBackend],
    async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond([{ sessionId: "mockId",
          userId:"mockUser",
          useCaseName:"mockName",
          useCaseStatus: "true",
          startTimestamp: "10",
          channel:"skype",
          useCaseLogId:"20"
        }]);
      });
      spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
      workerBotService.listConversationFlows("mockId").subscribe(response=>{
        // expect(response[0].useCaseName).toEqual("mockName");
      });
    }))

    it('service call post api for  getIntentList', inject(
      [ServiceAPIs, WorkerBotService,MockBackend],
      async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
        mockBackend.connections.subscribe(connection => {
          connection.mockRespond({ sessionId: "mockId",
          colName: "mockName",
          key: "mockKey"
          });
        });
        spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
        let response=workerBotService.getIntentList("mockId")
          // expect(response[0]).toEqual("mockName");
      })
);

it('service call post api for  getEntityList', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond({ sessionId: "mockId",
      colName: "mockName",
      key: "mockKey"
      });
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let response=workerBotService.getEntityList("mockId")
      // expect(response[0]).toEqual("mockName");
  })
);

it('service call post api for  getNLCLogs', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond("mockOutPut");
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let response=workerBotService.getNLCLogs("mockId")
      // expect(response).toEqual("mockOutput");
  })
);

it('service call post api for addUtternace', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond("mockOutPut");
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let response=workerBotService.addUtternace("mockId")
      // expect(response).toEqual("mockOutput");
  })
);

it('service call post api for reclassifyUtternace', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond("mockOutPut");
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let response=workerBotService.reclassifyUtternace("mockId");
      // expect(response).toEqual("mockOutput");
  })
);

it('service call post api for  getNplConversationDetails', inject(
  [ServiceAPIs, WorkerBotService,MockBackend],
  async (serviceAPIs: ServiceAPIs, workerBotService: WorkerBotService,mockBackend:MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond({conversationLog:[{ timestamp:"10",
        userMessage:"hi",
        response:[]}]});
    });
    spyOn(serviceAPIs, 'getApiUrl').and.callThrough();
    let response=workerBotService.getNplConversationDetails("mockId").subscribe(response=>{
      return response
    });
      // expect(response[0].userMessage).toEqual("hi");
  })
);
})
