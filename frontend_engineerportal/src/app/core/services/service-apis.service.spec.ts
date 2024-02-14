import { TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ServiceAPIs } from "./service-apis.service";
import { ENVIROMENTS } from "src/app/config";
import { environment } from "src/environments/environment.mock";

const envMock={"MOCK":"MOCK"};

describe('Service API', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[ServiceAPIs,{provide:ENVIROMENTS,useValue:"envMock"}]
    });
  });

  it("should be defined",inject([ServiceAPIs],(api:ServiceAPIs)=>{
expect(api).toBeDefined();
  }))

  it("should get API url",inject([ServiceAPIs],(api:ServiceAPIs)=>{
    environment.MODE="MOCK"
api.getApiUrl("LIST_BOTS");
  }))

  
it("should get WSAPIUrl",inject([ServiceAPIs],(api:ServiceAPIs)=>{
    api.getWSAPIUrl("ENGINEERPORTAL_ADAPTER_CHAT");
      }))


it("should geturl path",inject([ServiceAPIs],(api:ServiceAPIs)=>{
        api.getUrlPath("ENGINEERPORTAL_ADAPTER_SOCKET");
  }));


it("should getHttpHeaders",inject([ServiceAPIs],(api:ServiceAPIs)=>{
    api.getHttpHeaders("post");
    api.getHttpHeaders("put");
}));


it("should getHttpParams",inject([ServiceAPIs],(api:ServiceAPIs)=>{
  api.getHttpParams({key:{data:"mockData"}});
  api.getHttpParams({key:"mockKey"});
}));


})