import { UtilService } from '../../services/util.service';
import {Conversation} from "src/app/bot-builder/model/conversation.model";
import { TestBed ,inject, async} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


const data={ useCaseId:"MockId",
  conversationFlowId:"MockId",
  channel: "WEB",
  flow: ["mock1","mock2","mock3"],
  exitPoint: "",
  createdBy: "Mock",
  createdOn: "18/11/2019",
  updatedBy: "Mock",
  updatedOn: "19/11/2019"}

  class utilMockService{
    getAdminFullName(){
      return "MockName"
    }
  }

describe('Conversation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[Conversation,{provide:UtilService,useClass:utilMockService},CookieService]
    });
  });

  it("should be defined",inject([Conversation],(convo:Conversation)=>{
   expect(convo).toBeDefined();
      }))

  it("should deserialize the input",inject([Conversation],(convo:Conversation)=>{
  spyOn(convo,"mapFromApi");
  convo.deserialize(data);
  expect(convo.mapFromApi).toHaveBeenCalledWith(data);
  }))

  it("should map from API",inject([Conversation],(convo:Conversation)=>{
    convo.mapFromApi(data);
  }))

  it("should updateApi",inject([Conversation,UtilService],(convo:Conversation,util:UtilService)=>{
    spyOn(util,"getAdminFullName").and.returnValue("MockName");
    let data=convo.mapToUpdateApi({'useCaseId':"MOckId",'channel':"Web"})
    // expect(data).toEqual({'useCaseId':"MOckId",'channel':"Web",updatedBy:"MockName"})
  }))

  it("should putApi",inject([Conversation,UtilService],(convo:Conversation,util:UtilService)=>{
    spyOn(util,"getAdminFullName").and.returnValue("MockName");
    let data=convo.mapToPutApi({'useCaseId':"MOckId",'channel':"Web"})
    // expect(data).toEqual({'useCaseId':"MOckId",'channel':"Web",updatedBy:"MockName",createdBy:"MockName"})
  }))

})