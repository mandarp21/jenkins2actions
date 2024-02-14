import { Component, Input } from '@angular/core';
import { FlowComponent } from './flow.component';
import { TestBed, inject } from '@angular/core/testing';
import { CompilerFactory, Compiler } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkerBotService } from '../../worker-bot/services/worker-bot.service';
import { ConversationService } from '../services/conversation.service';
import { UtilService } from '../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs/internal/observable/from';
import { ServiceAPIs } from '../../core/services/service-apis.service';
import { ToastrService } from 'ngx-toastr';
import { of, Observable } from 'rxjs';

@Component({
	selector: 'nav-bar',
	template: '',
})

export class NavBarMockComponent {
  @Input() title;
  @Input() prevpage;
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
  @Input() boolGreen;
  @Input() type;
  @Input() isDisabled;
}

@Component({
  selector: 'test-chat',
  template: '',

})
export class TestChatMockComponent{
  @Input() showChatModal;
}

@Component({
  selector: 'external-reference-info',
  template: '',

})
export class externalreferenceMockComponent{
  @Input() showChatModal;
}

class ToastrMockService{

}

class utilMockService{
  getSessionStorage(data){
    return JSON.stringify({"name":"name",id:"mockId"})
  }
}

class workerbotMockService{
  getIntentList(data):Promise<any>{
   return Promise.resolve({entityOtions:"mockOptions",entityValues:"mockValues"})
  }

  getEntityList(data):Promise<any>{
    return Promise.resolve({entityOtions:"mockOptions",entityValues:"mockValues"})
  }
}
let router: Router;
let util: UtilService;
let compiler: Compiler;
let active: ActivatedRoute;
let conv: ConversationService;
let work: WorkerBotService;

describe('flow component', function () {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [FlowComponent,
        NavBarMockComponent,
        TestChatMockComponent,
        ButtonMockComponent,externalreferenceMockComponent
      ],
      providers: [
        CookieService,
        {provide:WorkerBotService,useClass:workerbotMockService},
        ServiceAPIs,
        { provide: ToastrService, useClass: ToastrMockService} ,
        ConversationService,{provide:UtilService,useClass:utilMockService}
      ]
    });
 
  });


  it('Component to be defined', inject([ConversationService,WorkerBotService],(convo:ConversationService,worker:WorkerBotService) => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    spyOn(convo,"copyChannelsObs").and.returnValue(of(true));
    spyOn(convo,"activeChannelObs").and.returnValue(of("web"));
    // component.conversationFlowId="mockId";
    // component.conversationFlows=[{channel:"skype",conversationFlowId:"mockId"}];
    component.channelType="skype";
    fixture.detectChanges();
    expect(component).toBeDefined();
  }))

  it('Fetch conversaion data from BE', inject([ConversationService], async (conversationService: ConversationService) => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(conversationService, "setConversationData");
    spyOn(conversationService, "getUseCase").and.returnValues(of({"useCaseName": "dummy"}));
    spyOn(conversationService, "setUseCaseData");
    spyOn(conversationService, "listConversationFlows").and.returnValues(of({"useCaseId": 1234}));;
    spyOn(conversationService, "conversationFlowsObs").and.returnValues(Observable.of({"useCaseName": "dummy", "dummy":"dummy"}));
    spyOn(conversationService, "resetSideBar");
    spyOn(conversationService, "getConversationData");
    spyOn(conversationService, "setWorkerBotId");
    spyOn(conversationService, "getConversation").and.returnValues(of({"useCaseId": 1234,
    "channel":"skype",
    "flow" : [{"currentStep": 2}]
  }));
    component.getConversationData();
    expect(component.data).not.toBeNull;
    expect(component.useCaseName).not.toBeNull;
    expect(component.conversationFlows).not.toBeNull;
    //expect(component.channelsDropdownEnabled).toBe(true);
    expect(component.channel).not.toBeNull;
    expect(component.graph).not.toBeNull;
    expect(component.data.flow).toBeTruthy;
    expect(component.data.flow).toBeDefined;
    expect(component.data.flow[0].currentStep).toBeDefined;
    expect(component.conversationTreeHTML).not.toBeNull;

  }));

  it('Fetch conversaion data from BE with flow response as undefined', inject([ConversationService], async (conversationService: ConversationService) => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(conversationService, "setConversationData");
    spyOn(conversationService, "getUseCase").and.returnValues(of({"useCaseName": "dummy"}));
    spyOn(conversationService, "setUseCaseData");
    spyOn(conversationService, "listConversationFlows").and.returnValues(of({"useCaseId": 1234}));;
    spyOn(conversationService, "conversationFlowsObs").and.returnValues(Observable.of({"useCaseName": "dummy", "dummy":"dummy"}));
    spyOn(conversationService, "resetSideBar");
    spyOn(conversationService, "getConversationData");
    spyOn(conversationService, "setWorkerBotId");
    spyOn(conversationService, "getConversation").and.returnValues(of({"useCaseId": 1234,
    "channel":"skype",
    "flow" : [{"currentStep": 2}]
  }));
    component.getConversationData();
    expect(component.data).not.toBeNull;
    expect(component.useCaseName).not.toBeNull;
    expect(component.conversationFlows).not.toBeNull;
    //expect(component.channelsDropdownEnabled).toBe(true);
    expect(component.channel).not.toBeNull;
    expect(component.graph).not.toBeNull;
    component.data.flow = undefined;
    expect(component.conversationTreeHTML).not.toBeNull;
    expect(component.dynamicComponent).not.toBeNull;
    expect(component.dynamicModule).not.toBeNull;
  }));

  it('handling channels dropdown click', async () => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.channelsDropdownEnabled = true;
    component.channelsDropdownActive = false;
    component.handleChannelsDropdownClick();
    expect(component.channelsDropdownActive).toBe(true);
  });

  it('get active channels', inject([ConversationService], async (conversationService: ConversationService) => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(conversationService, "setActiveChannel");
    component.conversationFlowId = "12";
    component.conversationFlows = [{"conversationFlowId": "12", "channel":"fb"}];
    expect(component.conversationFlows).toBeTruthy();
    expect(component.getActiveChannel()).not.toBeNull;

  }));

  // it('test and save conversation', inject([ConversationService], async (conversationService: ConversationService) => {
  //   const fixture = TestBed.createComponent(FlowComponent);
  //   const component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   spyOn(conversationService,"saveConversation").and.callThrough();
  //   component.saveConversation();
  //   component.testConversation();
  //   expect(component.showChatModal).toBe(true);
   
  // }));

  it('should navigate to /workerbot on calling navigateToWorkerBotConfig', inject([Router], async (router: Router) => {
    const fixture = TestBed.createComponent(FlowComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(router, "navigate");
    component.workerBotId = "12";
    component.navigateToWorkerBotConfig();
    expect(router.navigate).toHaveBeenCalledWith(['workerbot', '12']);
  }));

  // it('should redo or undo actions successfully', inject([ConversationService], async (conversationService: ConversationService) => {
  //   const fixture = TestBed.createComponent(FlowComponent);
  //   const component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   const data = {"flow" : [{"currentStep": 4}]};
  //   // spyOn(conversationService, "getPreviousStep")//.and.returnValue(data);
  //   // spyOn(conversationService, "getRedoStep");
  //   spyOn(conversationService, "resetSideBar");
  //   spyOn(conversationService, "setConversationData");

  //   //--actions equals undo
  //   // component.redoOrUndo('undo');
  //   // expect(conversationService.getPreviousStep).toHaveBeenCalled();

  //   // //verify if(this.data)
  //   // //component.data = {"flow" : [{"currentStep": 2}]};
  //   // //component.redoOrUndo('undo');
  //   // // expect(conversationService.resetSideBar).toHaveBeenCalled();
  //   // // expect(conversationService.setConversationData).toHaveBeenCalledWith(component.data);
  //   // expect(component.graph).not.toBeNull();
  //   // //expect(graph.bfs).toHaveBeenCalledWith(component.data.flow[0].currentStep);
  //   // expect(component.dynamicComponent).not.toBeNull();
  //   // expect(component.dynamicModule ).not.toBeNull();


  //   //--actions equals redo
  //   // component.redoOrUndo('null');
  //   // expect(conversationService.getRedoStep).toHaveBeenCalled();
  // }));

  // it('Temporary', inject([Router], async (router: Router) => {
  //   const fixture = TestBed.createComponent(FlowComponent);
  //   const component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   //let createNewComponent : any = component.myMethod().createNewComponent();
  //   //let dynamicComponent = component.createNewComponent("dummy", "dummy");


  // }));
});
