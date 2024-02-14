import { Component, Input } from '@angular/core';
import { CEVariableFormComponent } from './ce-form-variable.component';
import { TestBed, inject } from '@angular/core/testing';
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

class ConversationMockService {
 config = JSON.stringify({boolCaseSensitive:true,headers:"mockheaders",parameters:null,body:null,resetApiCall:true,success:{name:"mockname"}});
  public variableObs: any = new BehaviorSubject<any>({id:"mockid",
  masterBotId:"mockmasterbotid",
  name:"mockname",
  type:"mocktype",
  description: "mockdes",
  config:this.config}).asObservable();

  listVariables():Promise<any>{return new Promise((resolve,reject)=>{
    reject() })}

  setVariablesOptions(listVariables){  };

  public updateVariable(payloadToSend):Promise<any>{
    if(payloadToSend.id==="mockId"){
    return new Promise((resolve,reject)=>{
     resolve({name:"mockName"})
  })}
  else{
    return new Promise((resolve,reject)=>{
      reject({error:"mockName"})})
  }}



  public createVariable(payloadToSend):Promise<any>{
    if(payloadToSend.id==="mockId"){
      return new Promise((resolve,reject)=>{
       resolve({name:"mockName"})
    })}
    else{
      return new Promise((resolve,reject)=>{
        reject({error:"mockName"})})
    }
  }
}

class UtilMockService {
  getSessionStorage(data){
 return JSON.stringify({"id":"c094f4c9-b232-44bf-97fa-9a5bda54673c","name":"Nycers"})
  }
}

let router: Router;
let util: UtilService;
let compiler: Compiler;
let active: ActivatedRoute;
let conv: ConversationService;
let work: WorkerBotService;

describe('CE Form Variable Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CEVariableFormComponent,
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
        { provide: ConversationService, useClass: ConversationMockService},FormBuilder
      ]
    });
    fixture = TestBed.createComponent(CEVariableFormComponent);
    component = fixture.componentInstance;
    component.resetVariables=true;
    fixture.detectChanges();
  });


  it('Component to be defined', async () => {
    expect(component).toBeDefined();
  });
  
  it('check path is changed onchange ',()=>{
    component.onChange({target:{value:"mockValue"}},"varTitle");
    expect(component.varTitle).toEqual("mockValue");
    component.onChange({target:{value:"mockValue"}},"");
    expect(component.varTitle).toEqual("mockValue");
  })
 
  it("change config key ",()=>{
    component.selChangeConfig({key:"mock"},0);
    expect(component.config[0]).toEqual("mock");
  })
  
  it("changetype works",()=>{
    component.changeType({key:"mock"});
    expect(component.type).toEqual("mock");
    component.changeType("mock",0);
  })

  it("add variable functionality works",()=>{
    component.varTitle="mock1";
    component.varPath="mock2";
    component.addVar();
    expect(component.varTitle).toEqual('');
  })

  it("remove variable functionality works",()=>{
component.varData=["mock1","mock2","mock3"];
component.removeVar("mock3");
  })

  it("handleSave functionality works",()=>{
    component.name="";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockid";
    component.type="StaticValue";
    component.config= {apiUri:"",
    method:"",
    headers:"",
    parameters:"",
    body:"",
    success:"",
    exception:"",
    resetApiCall:"",valueType:""}
    component.handleSave();
  })

  it("handlesave works if type is API",()=>{
    component.name=".";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockid";
    component.type="API";
    component.config= {apiUri:"",
    method:"",
    headers:"mock",
    parameters:"mock",
    body:"mock",
    success:"",
    exception:"",
    resetApiCall:"",valueType:""}
    component.handleSave();
  })

  it("handlesave works if type doesnt exist variable id exists",inject([ConversationService],(ConversationService)=>{
    // let data= new Promise((resolve,reject)=>{reject(new Error("error"))})
    // spyOn(ConversationService,"updateVariable").and.returnValue(Promise.resolve({"name":"mockName"}));
    component.name="mockName";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockId";
    component.variable={id:"mockId",masterBotId:"mockMasterBotId",
      name:"mockName",type:"mockType",description:"mockDes",config: {apiUri:"",
      method:"",
      headers:"mock",
      parameters:"mock",
      body:"mock",
      success:[],
      exception:"",
      resetApiCall:"",valueType:""}}
   component.handleSave();
  }))

  it("handlesave works if type doesnt exist 1",inject([ConversationService],(ConversationService)=>{
    component.name="mockName";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockId";
    component.variable={masterBotId:"mockMasterBotId",
      name:"mockName",type:"mockType",description:"mockDes",config: {apiUri:"",
      method:"",
      headers:"mock",
      parameters:"mock",
      body:"mock",
      success:[],
      exception:"",
      resetApiCall:"",valueType:""}}
    component.handleSave();
  }))
  
  it("handlesave works if type doesnt exist 3",inject([ConversationService],(ConversationService)=>{
    // let data= new Promise((resolve,reject)=>{reject(new Error("error"))})
    // spyOn(ConversationService,"createVariable").and.returnValue(data);
    component.name="mockName";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockId1";
    component.variable={masterBotId:"lockMasterBotId",id:"mockId1",
      name:"mockName",type:"mockType",description:"mockDes",config: {apiUri:"",
      method:"",
      headers:"mock",
      parameters:"mock",
      body:"mock",
      success:"",
      exception:"",
      resetApiCall:"",valueType:""}}
    component.handleSave();
  }))

  it("handlesave works if type doesnt exist 4",inject([ConversationService],(ConversationService)=>{
    // let data= new Promise((resolve,reject)=>{reject(new Error("error"))})
    // spyOn(ConversationService,"createVariable").and.returnValue(data);
    component.name="mockName";
    component.description="mockdes";
    component.masterBotId="mockid";
    component.id="mockId1";
    component.variable={masterBotId:"lockMasterBotId",
      name:"mockName",type:"mockType",description:"mockDes",config: {apiUri:"",
      method:"",
      headers:"mock",
      parameters:"mock",
      body:"mock",
      success:"",
      exception:"",
      resetApiCall:"",valueType:""}}
    component.handleSave();
  }))

  it("formatVariables functionality works",()=>{
component.varData=["mock1","mock2","mock3"];
    component.formatVariables({success:""});
  })

  it("filter config functionality works",()=>{
    component.type="API";
    let data = {apiUri:"",
    method:"",
    headers:"",
    parameters:"",
    body:"",
    success:"",
    exception:"",
    resetApiCall:""}
    component.filterConfig(data);
    component.type="StaticValue";
    component.filterConfig({valueType:"",value:"",boolCaseSensitive:""});
    component.type="ContextObject";
    component.filterConfig({value:""})
  })

  it("should updateSuccessValues",()=>{
    component.config={success:{title:""},data:""};
    component.updateSuccessValues([{path:"mockPath",title:"mockTitle"}]);
    component.closeToaster();
    component.onChangeBoolCaseSensitive(true,"data");
  })
});