import { Component, Input } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { CompilerFactory, Compiler } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { ConversationService } from '../../../../services/conversation.service';
import { UtilService } from '../../../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { ServiceAPIs } from '../../../../../core/services/service-apis.service';
import { ToastrService } from 'ngx-toastr';
import { of, Observable,BehaviorSubject } from 'rxjs';
import { DropDownOption } from '../../../../../model/dropdown-option.model';
import { COMPONENT_FACTORY_RESOLVER } from '@angular/core/src/render3/ng_module_ref';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { CEReferenceFormComponent } from './ce-form-reference.component';
import { MasterBotService } from 'src/app/master-bot/services/master-bot.service';
import { WorkerBot } from 'src/app/model/worker-bot';
import { getQueryValue } from '@angular/core/src/view/query';




@Component({
	selector: 'converse-switch-button',
	template: '',
})
class SwitchButtonMockComponent {
	@Input() disabled;
	@Input() checked;
}

@Component({
  selector: 'input-autocomplete',
  template: '',
})

export class InputAutocompleteMock {
  @Input() message;
  @Input() placeholder;
  @Input() type;
  @Input() id;
}


@Component({
  selector: 'nav-bar',
  template: '',
})

export class NavBarMockComponent {
  @Input() title;
  @Input() prevpage;
}

@Component({
  selector: 'custom-values-list',
  template: '',
})

export class CustomValuesListMockComponent {
  @Input() selected;
  @Input() ceFormSuccessError;
  @Input() type;
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
  @Input() activateColors;
}

@Component({
  selector: 'test-chat',
  template: '',

})
export class TestChatMockComponent {
  @Input() showChatModal;
}

@Component({
  selector: 'converse-drop-down',
  template: ''
})

export class DropDownMockComponent {
  @Input('data')
  data: any[];
  @Input('id')
  id: string;
  @Input()
  showtitle: string;
  @Input()
  icondisplay: string;
  @Input()
  inwidth: string;
  @Input()
  inleft: string;
  @Input()
  selected: string;
  @Input() placeholder;
  @Input() hasEmptyOption: boolean;
  @Input() ceFormVariableTypeError;
  @Input() ceFormMethodError;
  @Input() ceFormValueType;
}

@Component({
  selector: 'converse-drop-down-multiple',
  template: ''
})

export class DropDownComponentMockMultiple {
  @Input('data')
  data: any[];
  @Input()
  showtitle: string;
  @Input()
  selected: any;
}

class ToastrMockService {
  error(){};
success(){};
}

class masterbotmockservice{
listWorkerBots():Observable<any>{
  return Observable.of([{botId:"mockId",botName:"mockNAme",botDescription:"mockDes",createdOn:"18-10-2019"}])
}
}
class ConversationMockService {
  variableObs :Observable<any>= new BehaviorSubject<any>({id:"mockid",
  masterBotId:"mockmasterbotid",
  name:"mockname",
  type:"mocktype",
  description: "mockdes",
  config:"mockcon"}).asObservable();

  listVariables(){

  }
  setVariablesOptions(listVariables){

  }

  getConversation(data):Observable<any>{
    return of({flow:[{owner:"bot",currentStep:"mockStep",description:["good"],responseType:"web"}]})
  }
  updateVariable(payloadToSend){}
  createVariable(payloadToSend){}
  getConversationData(){
    let data =new BehaviorSubject<object>({ useCaseId:"",channel:"web",
    useCaseName: "mockName",
    useCaseDescription: "mockdescription",
    useCaseStatus: "",
    createdBy: "18-10-2019",
    updatedBy: "mock",
    createdOn: "16-10-2019",
    updatedOn: "26-10-2019",
    averageHumanHandlingTime: "10-12-2019",
    collectFeedback: false,
    useCaseChannel: ["web","skype"],
    isEditable: false,
    conversationType: ""})
   return data;
  }
}

class UtilMockService {
  getSessionStorage(data){
 return JSON.stringify({"id":"c094f4c9-b232-44bf-97fa-9a5bda54673c","name":"Nycers"})
  }
}

class workerbotmockservice{
  getListUseCases():Observable<any>{
return Observable.of([{ useCaseId:"",
  useCaseName: "mockName",
  useCaseDescription: "mockdescription",
  useCaseStatus: "",
  createdBy: "18-10-2019",
  updatedBy: "mock",
  createdOn: "16-10-2019",
  updatedOn: "26-10-2019",
  averageHumanHandlingTime: "10-12-2019",
  collectFeedback: false,
  useCaseChannel: ["web","skype"],
  isEditable: false,
  conversationType: ""}])
  }

  listConversationFlows():Observable<any>{
    return Observable.of([{ useCaseId:"mockId",
      useCaseName: "mockNAme",
      useCaseDescription:"",
      useCaseStatus:"",
      createdBy:"",
      updatedBy:"",
      createdOn:"",
      updatedOn:"",
      averageHumanHandlingTime:"",
      collectFeedback:false,
      useCaseChannel:["web","skype"],
      isEditable: false,
      conversationType:""}])
  } 
}
describe('CE Form referenceComponent', function () {
  let component:CEReferenceFormComponent;
  let fixture: ComponentFixture<CEReferenceFormComponent>;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CEReferenceFormComponent,
        SwitchButtonMockComponent,
        DropDownMockComponent,
        InputAutocompleteMock,
        DropDownComponentMockMultiple,
         ButtonMockComponent,CustomValuesListMockComponent
      ],
      providers: [
       {provide:UtilService,useClass:UtilMockService},
       CookieService,
       WorkerBotService,
        ServiceAPIs,
        { provide: ToastrService, useClass: ToastrMockService },
        { provide: ConversationService, useClass: ConversationMockService} ,
        {provide:MasterBotService,useClass:masterbotmockservice},{provide:WorkerBot,useClass:workerbotmockservice},
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be defined",()=>{
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
  expect(component).toBeDefined();
  })

  it("should change workerbot",inject([WorkerBotService],(WorkerBotService)=>{
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
spyOn(WorkerBotService,"getListUseCases").and.returnValue(of([{ useCaseId:"",
useCaseName: "mockName",
useCaseDescription: "mockdescription",
useCaseStatus: "",
createdBy: "18-10-2019",
updatedBy: "mock",
createdOn: "16-10-2019",
updatedOn: "26-10-2019",
averageHumanHandlingTime: "10-12-2019",
collectFeedback: false,
useCaseChannel: ["web","skype"],
isEditable: false,
conversationType: ""}]))
    component.onSelChangeWorkerBot({key:"mockKey"});
  }))

  it("should change use case",inject([WorkerBotService,ConversationService],(WorkerBotService,ConversationService)=>{
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
spyOn(WorkerBotService,"listConversationFlows").and.returnValue(of([{ useCaseId:"mockId",channel:"web",
useCaseName: "mockNAme",
useCaseDescription:"",
useCaseStatus:"",
createdBy:"",
updatedBy:"",
createdOn:"",
updatedOn:"",
averageHumanHandlingTime:"",
collectFeedback:false,
useCaseChannel:["web","skype"],
isEditable: false,
conversationType:"",conversationFlowId:"mockId",flow:[]}]));
// spyOn(ConversationService,"getConversationData").and.returnValue({ useCaseId:"",channel:"web",
// useCaseName: "mockName",
// useCaseDescription: "mockdescription",
// useCaseStatus: "",
// createdBy: "18-10-2019",
// updatedBy: "mock",
// createdOn: "16-10-2019",
// updatedOn: "26-10-2019",
// averageHumanHandlingTime: "10-12-2019",
// collectFeedback: false,
// useCaseChannel: ["web","skype"],
// isEditable: false,
// conversationType: ""}
// );
    component.onSelChangeUseCase({colName:"mockNAme",key:"mockKey"});
  }))

  it("should change responseNOde",()=>{
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
    component.onSelChangeResponseNode({colName:"mockNAme",key:"mockKey"});
    expect(component.responseNodeName).toEqual("mockNAme");
  })

  it("should change  handleSave",()=>{
    fixture = TestBed.createComponent(CEReferenceFormComponent);
    component = fixture.componentInstance;
    component.workerbot="mock";
    component.usecase="mock";
    component.responseNode="mock";
    component.handleSave();
    component.handleCancel();
  })

})