import { TestBed, inject, async } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { UtilService } from 'src/app/services/util.service';
import { WorkerBotService } from '../../worker-bot/services/worker-bot.service';
import {ConversationService} from "src/app/bot-builder/services/conversation.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ServiceAPIs } from '../../core/services/service-apis.service';
import { componentFactoryName } from "@angular/compiler";
import { MockBackend } from "@angular/http/testing";
import { BaseRequestOptions, Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable, of } from "rxjs";

const responseData= {
  useCaseId: "1234",
  conversationFlowId: "5678",
  channel: "skype",
  exitPoint: "",
  createdBy: "Jack",
  createdOn: "",
  updatedBy: "David",
  updatedOn: "",
  flow:[]
}

const responseDataUseCase= { useCaseId:"1234",
useCaseName: "mockName",
useCaseDescription: "",
useCaseStatus: "",
createdBy: "mock",
updatedBy: "mockName",
createdOn: "18/10/2019",
updatedOn: "20/10/2019",
averageHumanHandlingTime:"",
collectFeedback: true,
useCaseChannel: [],
isEditable: false,
conversationType: "",
mapToPostApi(data){}}

class utilMockService{
  getSessionStorage(data){
    return JSON.stringify({data:"mockData"})
  }
  getAdminFullName(data){
    return "mockName"
  }
  
}

class workerBotMockService{
  updateUseCases(data):Observable<any>{
    return Observable.of({data:"mockData"});
  }

}
class ServiceAPIMockService{
  getApiUrl(data){
    return data;
  }
}

class htmlMock{
lastChild={"children":""}
}

describe('ConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[ToastrModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[MockBackend,BaseRequestOptions,ConversationService,{provide:UtilService,useClass:utilMockService},{provide:ServiceAPIs,useClass:ServiceAPIMockService},{provide:WorkerBotService,useClass:workerBotMockService},{
        deps: [MockBackend, BaseRequestOptions],
        provide: HttpClient,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }},CookieService,{provide:HTMLElement,useClass:htmlMock}]
    });
  });

beforeEach(inject([ConversationService],(convo:ConversationService)=>{
  convo.toggleCreateUseCaseModal();
  convo.setVariablesOptions({data:null});
  convo.setActiveComponent({data:null});
  convo.setVariablesOptions({data:null});
  convo.setLinkActive(null);
  convo.setActiveExternalRef(null);
  convo.hideOverlay(null);
  convo.copyChannels(null);
  convo.setWorkerBotId("mockId");
  var elem = document.createElement('div');
  var html=document.body.appendChild(elem);
  convo.setTreeContainer(html);
  convo.generateID();
  convo.resetSideBar();
  convo.showSideBar();
  convo.closeSideBar();
  convo.isSideBarOpen();
  convo.setConversationData(responseData);
  convo.getConversationData();
  convo.setUseCaseData(responseDataUseCase);
  convo.setFirstNode("mockValue");
  convo.isFirstNode();
  convo.setNodeComponents([{type :'reference-card',useCaseId:"mockId"}]);
}))

it("should be defined",inject([ConversationService],(convo:ConversationService)=>{
expect(convo).toBeDefined();
}))

it("should updateConversationData",inject([ConversationService],(convo:ConversationService)=>{
  convo.setNodeComponents([{user:"mockUser",id:"mockId",useCaseId:"mockId",type:"flow-card",nativeElement:{parentElement:{lastChild:{children:[{firstChild:"reference-card"}]}}}}]);
  spyOn(convo,"getEntryNodes").and.returnValue([{"data":"mockData"}])
  convo.updateConversationData(true);
  }))

it("should getConversation",inject([ConversationService,MockBackend],(convo:ConversationService,backend:MockBackend)=>{
  backend.connections.subscribe(connection => {
    connection.mockRespond(responseData);
  });
convo.getConversation("mockId").subscribe(response=>{
    expect(response.useCaseId).toEqual(responseData.useCaseId);
  });
    }))

it("should listConversationFlows",inject([ConversationService,MockBackend],(convo:ConversationService,backend:MockBackend)=>{
  backend.connections.subscribe(connection => {
    connection.mockRespond([responseData])
  })
  convo.listConversationFlows("mockId",true).subscribe(response=>{
    expect(response[0].useCaseId).toEqual(responseData.useCaseId);
  })
      }))

it("should createConversation",inject([ConversationService,MockBackend], (convo:ConversationService,backend:MockBackend)=>{
  backend.connections.subscribe(connection => {
    connection.mockRespond(responseData)
  })
 convo.createConversation("mockPayload").subscribe(response=>{
  expect(response.useCaseId).toEqual(responseData.useCaseId);
});
        })) 

it("should updateConversation",inject([ConversationService,MockBackend],(convo:ConversationService,backend:MockBackend)=>{
  backend.connections.subscribe(connection => {
    connection.mockRespond(responseData)
  })
   convo.updateConversation("mockPayload").subscribe(response=>{
  expect(response.useCaseId).toEqual(responseData.useCaseId);
  });
  }))
  
  it("should  getUseCase",inject([ConversationService,MockBackend],(convo:ConversationService,backend:MockBackend)=>{
    backend.connections.subscribe(connection => {
      connection.mockRespond(responseDataUseCase)
    })
    convo.getUseCase("mockPayload").subscribe(response=>{
    expect(response.useCaseId).toEqual(responseDataUseCase.useCaseId);
    });
    })) 

  it("should   listVariables",inject([ConversationService,MockBackend], async(convo:ConversationService,backend:MockBackend)=>{
      backend.connections.subscribe(connection => {
        connection.mockRespond([{name:"mockName"}])
      })
     await convo.listVariables();
    convo.variablesListObs.subscribe(response=>{
        expect(response[0]).toEqual("mockName");
      })
      })) 

  it("should   listVariablesFull",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
        backend.connections.subscribe(connection => {
          connection.mockRespond({name:"mockName"})
        })
      await  convo.listVariablesFull();
        convo.variableDetailsObs.subscribe(response=>{
          expect(response).toEqual({name:"mockName"});
        })
        })) 

it("should createVariable",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
            backend.connections.subscribe(connection => {
              connection.mockRespond("mockData")
            })
            let data=await convo.createVariable("mockData");
              expect(data).toEqual("mockData");
            })) 

it("should  updateVariable",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
              backend.connections.subscribe(connection => {
                connection.mockRespond("mockData")
              })
              let data=await convo.updateVariable("mockData");
                expect(data).toEqual("mockData");
              })) 

it("should getBotResponseConfig",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
                backend.connections.subscribe(connection => {
                  connection.mockRespond("mockData")
                })
                let data=await convo.getBotResponseConfig({botType:"options"});
                  expect(data.buttons).toEqual([]);
                })) 

it("should saveConversation",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
                  backend.connections.subscribe(connection => {
                    connection.mockRespond("mockData")
                  })
                spyOn(convo,"getEntryNodes").and.returnValue([{data:"mockdata"}]);
                spyOn(convo,"updateConversation").and.returnValue(of(true));
  convo.setNodeComponents([{user:"mockUser",id:"mockId",useCaseId:"mockId",type:"flow-card",nativeElement:{parentElement:{lastChild:{children:[{firstChild:"reference-card"}]}}}}]);
                  convo.updateConversationData(false);
                  await convo.saveConversation(false);
                  })) 

it("should findNextSteps for divering card",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
                    backend.connections.subscribe(connection => {
                      connection.mockRespond("mockData")
                    })
                    convo.setNodeComponents([{nativeElement:"reference-card",type:"reference-card"}])
  convo.findNextSteps({parentElement:{lastChild:{children:[{firstChild:"reference-card"}]}}})          
                    })) 

it("should findNextSteps for flow card",inject([ConversationService,MockBackend],async (convo:ConversationService,backend:MockBackend)=>{
                      backend.connections.subscribe(connection => {
                        connection.mockRespond("mockData")
                      })
                      convo.setNodeComponents([{nativeElement:"diverging-add-card",type:"flow-card"}])
    convo.findNextSteps({parentElement:{lastChild:{children:[{firstChild:"diverging-add-card"}]}}}) ;         
    convo.isFlowEmpty();
                      })) 
})
