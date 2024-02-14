import { TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { UtilService } from "./util.service";
import { CookieService } from "ngx-cookie-service";

class cookiemockService{
get(data){
  return data
}

delete(data){
  return data
}
}

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[UtilService,{provide:CookieService,useClass:cookiemockService}]
    });
  })

it("should be defined",inject([UtilService],(util:UtilService)=>{
expect(util).toBeDefined();
}))

it("should be publish data",inject([UtilService],(util:UtilService)=>{
  util.publishDateFilter({fromDate:"18-10-2019",toDate:"20-10-2019"});
  util.dateFilter$.subscribe(response=>{
    expect(response).toEqual({fromDate:"18-10-2019",toDate:"20-10-2019"});
  })
  util.publishMasterBot("mockId");
  util.masterBot$.subscribe(response=>{
    expect(response).toEqual("mockId")})
  }))

it("should be sortArray",inject([UtilService],(util:UtilService)=>{
util.sortArray([{intentName:"mockIntent1",selected: false},{intentName:"mockIntent1",selected: false}] ,'intentName','asc');
    }))

it("should be sortArray",inject([UtilService],(util:UtilService)=>{
      util.sortArray([{intentName:"mockIntent1",selected: false},{intentName:"mockIntent1",selected: false}] ,'customerSatisfaction','asc');
          }))


it("should call cookie service",inject([UtilService],(util:UtilService)=>{
  let data1 =util.getAdminFirstName();
      expect(data1).toEqual('adminFirstName');
  let data2=util.getAdminLastName();
expect(data2).toEqual("adminLastName");
util.getAdminFullName();
util.getAdminId();
util.deleteAuthCookies();
util.getAuthToken();
      }));


it("should get session storage",inject([UtilService],(util:UtilService)=>{
  spyOn(sessionStorage,"getItem").and.returnValue("success");
     let data1= util.getSessionStorage("mockInput");
     expect(data1).toEqual("success");
      util.getSessionStorage("mockInput");
      util.getSessionStorage("mockInput");

          }))
})