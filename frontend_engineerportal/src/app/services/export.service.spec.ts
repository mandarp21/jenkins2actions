import { TestBed ,inject} from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { MockBackend } from "@angular/http/testing";
import { BaseRequestOptions, Http } from "@angular/http";
import { ExportService } from "./export.service";
import { ServiceAPIs } from "../core/services/service-apis.service";
import { HttpClient } from "@angular/common/http";
import {UseCases} from "src/app/model/use-cases"

class ServiceAPIMockService{
  getApiUrl(data){
  return "mockApi"
  }
  }

describe('ExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[MockBackend,BaseRequestOptions,{provide:ServiceAPIs,useClass:ServiceAPIMockService},ExportService,{
        deps: [MockBackend, BaseRequestOptions],
        provide: HttpClient,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }}]
    });
  });
  it("should be defined",inject([ExportService],(app:ExportService)=>{
    expect(app).toBeDefined();
    }))

  it("should export and download",inject([ExportService,MockBackend],(app:ExportService,backend:MockBackend)=>{
    backend.connections.subscribe(response=>{
      response.mockRespond("success")
    })
app.exportAndDownload("mockData",{data:"mockdata"}).subscribe(response=>{
expect(response).toEqual("success");
})
  }))

  it("should get Usecase Id",inject([ExportService],(app:ExportService)=>{
    let data = new UseCases().deserialize({useCaseId:"mockId",useCaseName:"mockName"});
    let response=app.getUseCaseIds([data]);
expect(response).toEqual(["mockId"]);
    }))

//   it("should get file name",inject([ExportService],(app:ExportService)=>{
// app.getFileName("mockInput;/");
//    } )
  // )
})