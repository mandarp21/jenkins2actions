import { Component, Input } from '@angular/core';
import { ChannelsComponent } from './channels.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NewBotInfoComponent } from '../../../shared/component/new-bot-info/new-bot-info.component';
import { NewNlpAIInfoComponent } from '../../../shared/component/new-nlp-ai-info/new-nlp-ai-info.component';
import { DropDownComponent } from '../../../shared/component/drop-down/drop-down.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/of';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
import { UtilService } from '../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ConversationService } from '../../services/conversation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceAPIs } from '../../../core/services/service-apis.service';
import { WorkerBotService } from '../../../worker-bot/services/worker-bot.service'
import { UseCases } from '../../../model/use-cases';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Conversation } from '../../model/conversation.model';
import { componentFactoryName } from '@angular/compiler';

// let comp : CreateComponent;
// const fixture = TestBed.createComponent(CreateComponent);

class ToastrMockService { 
  error(v){
  }
  success(data){

  }
}
@Component({
  selector: 'overlay-component',
  template: ''
})
export class OverlayMockComponent {
  @Input() active;
}

@Component({
  selector: 'channels-editor',
  template: ''
})
export class ChannelsEditorMockComponent {
  @Input() channelsAvailable;
  @Input() type;
  @Input() currentChannelName;
  @Input() copyChannelError;
  @Input() addChannelError;
}

const useCase = {
  useCaseId: "1234",
  useCaseName: "",
  useCaseDescription: "",
  useCaseStatus: "",
  createdBy: "",
  updatedBy: "",
  createdOn: "",
  updatedOn: "",
  averageHumanHandlingTime: "",
  collectFeedback: true,
  useCaseChannel: [],
  entryIntents: [],
  entryEntities: [],
  cookieService: CookieService,
  utilService: UtilService,
  mapFromApi(): any { return },
  mapToPostApi(): any { return },
  deserialize(): any { return }
}

const conver: any = [{
  useCaseId: "",
  conversationFlowId: "",
  channel: "",
  flow: [],
  exitPoint: "",
  createdBy: "",
  createdOn: "",
  updatedBy: "",
  updatedOn: "",
  mapFromApi(): any { return },
  mapToPutApi(): any { return },
  mapToUpdateApi(): any { return },
  deserialize(): any { return },
}]

class ConversationMockService {

  setActiveChannel(){

  }
    listConversationFlows(x) {
     let data : Array<any>= [{ channel: "web" }]
      return of(data);
  }

  getUseCase():Observable<any>{

    const useCaseData = { "useCaseChannel": ["abcd"] }
    return Observable.of(useCaseData);
  }
 usecase=new UseCases().deserialize(useCase);
  useCaseDataObs = new BehaviorSubject<UseCases>(this.usecase).asObservable();
  conversationFlowsObs = new BehaviorSubject<any>([{ channel: "skype" }]).asObservable();


  getConversationData() {
    return of({'conversationFlowId':"mockId"});
  }

  createConversation(x) {
    let data :any = {};
    return of(data);
  }
  getConversation(val) {
    // if(val == "23")
    return of({exitPoint : 'old_exit', flow : [{channel:'skype',responseType:"msg"}]});

    // else if(val == "007")
    // return of({flow: [{responseType: 'crsl'}]});
    
    // else
    // return of({exitPoint : 'new_exit', flow : [{channel:'skype',responseType:"voice"}]});
  }

  editBeforeSaving()
  {

  }
}


describe('Channel Component Bot Builder', () => {

  let fixture: ComponentFixture<ChannelsComponent>;
  let comp: ChannelsComponent
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      declarations: [ChannelsComponent,
        OverlayMockComponent,
        ChannelsEditorMockComponent
      ],
      providers: [
        FormBuilder,
        UtilService,
        CookieService,
        ServiceAPIs,
        WorkerBotService,
        { provide: ToastrService, useClass: ToastrMockService },
        { provide: ConversationService, useClass: ConversationMockService },
        //ConversationService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ChannelsComponent);
    comp = fixture.componentInstance;
    //comp.conversationFlows = [{channel : "skype"}];
  });



  it('Component is defined', async() => {
 let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('click action handler, button clicked once', inject([ConversationService],async(conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    comp.handleClick("true"); 
    expect(comp.overlay).toEqual(true);
  }));

  it('click action handler, button clicked more than once',inject([ConversationService],async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    //spyOn(conversationService, "useCaseDataObs").and.returnValues(of(new UseCases()));
    comp.selectedAction = "true";
    comp.handleClick("true");
    expect(comp.overlay).toEqual(false);
  }));


  it('verify closeOverlay', inject([ConversationService], async(conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
      fixture.detectChanges();
    comp.closeOverlay();
    expect(comp.overlay).toBe(false);
    expect(comp.selectedAction).toEqual("hide");
  }));

  it('should Copy data of one channel to another', inject([ConversationService], async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    comp.conversationFlows = [{channel: 'skype', conversationFlowId: "23"}, {channel: 'web', conversationFlowId: "47"}]
    comp.copyConversationFlow('skype', 'web');
  }));

  it("should handles the case when 'copy entire flow' option is selected", inject([ConversationService], async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    let data = {formType: 'add', source: 'bot', toChannel: 'skype'}
    comp.handleCopySelection(data);

    comp.currentConversation = {channel: "web"};
    let data2 = {isCopyFrom: true, source: 'bot', toChannel: 'skype'}
    comp.handleCopySelection(data2);

    comp.currentConversation = {channel: "web"};
    let data3 = {isCopyFrom: false, source: 'bot', toChannel: 'skype'}
    comp.handleCopySelection(data3);
  }));

  it("should checks if copy action is possible for the selected channels", inject([ConversationService], async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    comp.conversationFlows = [{channel: 'skype', conversationFlowId: "007"}, {channel: 'web', conversationFlowId: "47"}]
    let from = 'skype';
    let to = 'voice';
    let result = await comp.isCopyPossible(from, to);
    expect(result).toEqual(true);

    // to = 'none';
    // result = await comp.isCopyPossible(from, to);
    // expect(result).toEqual(true);
    
    // let fromChanl = false;
    // result = await comp.isCopyPossible(fromChanl, to);
    // expect(result).toEqual(false);

  }));

  it("should creates new conversation flow", inject([ConversationService], async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    spyOn(comp,'handleCopySelection');
    const data = {channelType : 'sms', contentOp: 'copy-flow'};
    await comp.createConversation(data);

    const data2 = {channelType : 'sms', contentOp: 'none'};
    await comp.createConversation(data2);
  }));

  it("should handle channel editor button click", inject([ConversationService], async (conversationService: ConversationService) => {
    let usecase= await new UseCases().deserialize(useCase);
    comp.useCaseData=usecase;
    fixture.detectChanges();
    spyOn(comp,'closeOverlay');
    const data5 = {contentOp: 'create-empty'};
    spyOn(comp, 'createConversation');
    comp.handleEditorButton(data5);
    expect(comp.closeOverlay).toHaveBeenCalled();
    expect(comp.createConversation).toHaveBeenCalledWith(data5);

    const data = 'close';
    comp.handleEditorButton(data);
    expect(comp.closeOverlay).toHaveBeenCalled();

    const data2 = {selectedAction: 'channels-new'};
    comp.selectedAction = 'channels-new';
    comp.handleEditorButton(data2);

    const data3 = {source: 'old-channel'};
    spyOn(comp, 'handleCopySelection');
    comp.selectedAction = 'channels-copy';
    comp.handleEditorButton(data3);
    expect(comp.handleCopySelection).toHaveBeenCalled();

    const data4 = {contentOp: 'copy-flow', channelType: 'web'};
    comp.simpleTextChannels = ['web']
    comp.selectedAction = 'channels-new';
    comp.handleEditorButton(data4);
  }));
})
