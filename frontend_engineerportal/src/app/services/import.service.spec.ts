import { TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MockBackend } from "@angular/http/testing";
import { BaseRequestOptions, Http } from "@angular/http";
import { ServiceAPIs } from "../core/services/service-apis.service";
import { ImportService } from "./import.service";
import { HttpClient } from "@angular/common/http";


class ServiceAPIMockService{
  getApiUrl(data){
  return "mockApi"
  }
  }


describe('ExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[MockBackend,BaseRequestOptions,{provide:ServiceAPIs,useClass:ServiceAPIMockService},ImportService,{
        deps: [MockBackend, BaseRequestOptions],
        provide: HttpClient,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }}]
    });
  })

  it("should be defined",inject([ImportService],(app:ImportService)=>{
expect(app).toBeDefined();
  }))

  it(" importAndSave",inject([ImportService,MockBackend],(app:ImportService,backend:MockBackend)=>{
    backend.connections.subscribe(response=>{
      response.mockRespond("success");
    })
let data=app.importAndSave("mockApi",JSON.stringify({name:'mockFileName'}),"mockId");
// expect(data).toEqual("success");
  }))
})