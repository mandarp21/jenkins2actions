import { TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MockBackend } from "@angular/http/testing";
import { BaseRequestOptions, Http } from "@angular/http";
import { ServiceAPIs } from "../core/services/service-apis.service";
import { HttpClient } from "@angular/common/http";
import { AppService } from "./app.service";

class ServiceAPIMockService{
getApiUrl(data){
return "mockApi"
}
}

describe('AppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[MockBackend,BaseRequestOptions,{provide:ServiceAPIs,useClass:ServiceAPIMockService},AppService,{
        deps: [MockBackend, BaseRequestOptions],
        provide: HttpClient,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }}]
    });
  });


it("should be defined",inject([AppService],(app:AppService)=>{
expect(app).toBeDefined();
}))

it("should getUseCaseAnalytics",inject([AppService,MockBackend],(app:AppService,backend:MockBackend)=>{
  let data ={ automationData:{"data":"mockData"},escalationData:{"data":"mockData"},customerSatisfaction:{"data":"mockData"}}
  backend.connections.subscribe(response=>{
    response.mockRespond(data);
  })

app.getUseCaseAnalytics("18-11-2019","20-11-2019","mockID").subscribe(response=>{
expect(response.automationData).toEqual(data.automationData);
});
}))


it("should getListBots",inject([AppService,MockBackend],(app:AppService,backend:MockBackend)=>{
  let data ={masterBotId:"",masterBotName:"",masterBotDescription:""};
  backend.connections.subscribe(response=>{
    response.mockRespond([data,data]);
  })

app.getListBots("18-11-2019","mockID").subscribe(response=>{
expect(response[0].botId).toEqual(data.masterBotId);
});
}))

it("should getIntentMatched",inject([AppService,MockBackend],(app:AppService,backend:MockBackend)=>{
  backend.connections.subscribe(response=>{
    response.mockRespond("success");
  })

app.getIntentMatched("18-11-2019","20-10-2019","mockID").subscribe(response=>{
expect(response).toEqual("success");
});
}))

})