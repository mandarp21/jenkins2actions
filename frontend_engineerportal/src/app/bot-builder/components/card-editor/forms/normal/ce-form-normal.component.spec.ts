import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceAPIs } from '../../../../../core/services/service-apis.service';
import { ToastrService } from 'ngx-toastr';
import { CENormalFormComponent } from './ce-form-normal.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Utterance } from 'src/app/model/utterance';
import { ConversationService } from './../../../../services/conversation.service';
import { DropDownOption } from '../../../../../model/dropdown-option.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as helper from '../../../../utilities/helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';


@Component({
  selector: 'converse-button',
  template: '',
})

export class ButtonMockComponent {
  @Input() val;
  @Input() id;
  @Input() boolGreen;
  @Input() isDisabled;
  @Input() type;
  public update() {
    return true;
  }
}


@Component({
  selector: 'ce-section-messages',
  template: ''
})


export class CEMessagesSectionMockComponent {

  @Input()
  messages: Array<string>;
}


@Component({
  selector: 'ce-section-carousel',
  template: ''
})

export class CECarouselSectionMockComponent {

  @Input()
  imageData: Array<any>;

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
}

@Component({
  selector: 'custom-values-list',
  template: ''
})

export class customValueMockComponent {
  @Input('data')
  data: any[];
  @Input()
  type: string;
  @Input()
  selected: any;
}

@Component({
  selector: 'ce-section-feedback-tiles',
  template: ''
})

export class sectionFeedbackTilesMockComponent {
  @Input() tiles
}

@Component({
  selector: 'ce-section-feedback-req-msg',
  template: ''
})

export class sectionFeedbackReqMockComponent {
  @Input() message
}

@Component({
  selector: 'converse-switch-button',
  template: ''
})

export class switchMockComponent {
  @Input() checked
}



describe('Component: CE Form Normal Component', () => {

  let component: CENormalFormComponent;
  let fixture: ComponentFixture<CENormalFormComponent>;
  let bottomTextElem: DebugElement;

  class ToastrMockService {
    success(value, st) {
      const status = st;
    }
  }

  class ActivatedMockRoute {
    parent = {
      snapshot: {
        paramMap: {
          get(a) {
            return "test23";
          }
        }
      }
    }
  }

  class WorkerBotMockService {
    intentListOptionObs = of([{ "value": "intent" }]);

    entityListOptionObs = of([{ "value": "entity" }]);
  }

  class ConversationMockService {

    activeChannelObs = new BehaviorSubject<string>('dummyValue').asObservable();

    activeComponentObs = new BehaviorSubject<Object>({ value: "prime" }).asObservable();

    variablesOptionsObs: any = new BehaviorSubject<Array<DropDownOption>>([]).asObservable();

    useCaseDataObs:any = new BehaviorSubject<any>({useCaseName:"feedback"}).asObservable();

    isFirstNode(){
      return "Mock"
    };

  }


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CENormalFormComponent,
        CEMessagesSectionMockComponent,
        CECarouselSectionMockComponent,
        DropDownMockComponent,
        customValueMockComponent,sectionFeedbackReqMockComponent,sectionFeedbackTilesMockComponent,switchMockComponent,
        ButtonMockComponent
      ],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule,ReactiveFormsModule],
      providers: [
        { provide: WorkerBotService, useClass: WorkerBotMockService },
        ServiceAPIs,
        { provide: ToastrService, useClass: ToastrMockService },
        { provide: ConversationService, useClass: ConversationMockService }, FormBuilder
      ],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CENormalFormComponent);
    component = fixture.componentInstance;
  });
  it('should have a defined component', async () => {
    expect(component).toBeDefined();
  });

  it('should get intent list, entry list and api options on initialisation', async () => {
    component.ngOnInit();
    expect(component.intentOptions[0]).toEqual( {"value":"intent"} );
    expect(component.entityOptions[0]).toEqual({ "value": "entity" });
    expect(component.activeChannel).toEqual('dummyValue');
    expect(component.variableOptions).toEqual([]);
  });

  it('onSelChangeUser should update intent and entities', async () => {

    component.ngOnInit();
    let type = 'intent';
    let data: any = { key: '123' }
    component.onSelChangeUser(type, data);

    type = 'entities';
    data = [{ key: '123' }]
    component.onSelChangeUser(type, data);

  });

  it('initial values should be loaded when form is blank', async () => {
    component.dynamicButtonsIterableProperty= { key: '', values: ["mock1","mock2"], staticbuttons: ["mock3","mock4"] }
    component.buildForm(null);
    expect(component.stepDescription).toEqual('');
    expect(component.owner).toEqual('');
    expect(component.type).toEqual('');
    expect(component.intent).toEqual('');
    expect(component.selectedApi).toEqual('');
    expect(component.selectedDateRestriction).toEqual(helper.DATE_RESTRICTION_OPTIONS_ENUM.NR);
    expect(component.entities).toEqual([]);
    expect(component.messages).toEqual(['']);
    expect(component.tempMessages).toEqual(['']);
    expect(component.carouselImages).toEqual([]);
    expect(component.isEdit).toEqual(false);
   let form = { dynamicButtonsIterableProperty:{ key: '', values: ["mock1","mock2"], staticbuttons: ["mock3","mock4"] }}
    component.buildForm(form);
  });

  it('should select change API on calling onSelectChangeAPI', async () => {

    const data = { key: "key123" }
    component.ngOnInit();
    component.onSelectChangeAPI(data);
    expect(component.selectedApi).toEqual('key123');
  });

  it('should change owner on calling changeOwner', async () => {

    const data = "newOwner";
    component.ngOnInit();
    component.isEdit = false;
    component.changeOwner(data);
    expect(component.owner).toEqual('newOwner');
  });

  it('should change type on calling changeType', async () => {
    const data = { id: "whatsapp"};
    component.ngOnInit();
    component.isEdit = true;
    component.changeType(data);
    expect(component.owner).toEqual('bot');
    expect(component.type).toEqual("");
  });

  it('should update form message on calling messagesUpdate', async () => {

    const data = { index: 0, value: "hi" };
    component.ngOnInit();
    component.messagesUpdate(data);
    expect(component.tempMessages[data.index]).toEqual(data.value);
    expect(component.stepForm.value.messages).toEqual('["hi"]');
  });

  it('should update carousel image on calling filesListUpdate', async () => {

    const data = "test";
    component.ngOnInit();
    component.filesListUpdate(data);
    expect(component.stepForm.value.carouselImages).toEqual("test");
  });

  it('should update selectDateRestriction on calling onSelectChangeRestriction', async () => {

    const data = { key: "true", selectedDateRestriction: "true" };
    component.ngOnInit();
    component.onSelectChangeRestriction(data);
    expect(component.stepForm.value.selectedDateRestriction).toEqual("true");
  });

  it('should save on call of handleSave', async () => {
    let formbuilder=new FormBuilder();
    let form=formbuilder.group([{formname:'',Validators}]);
    component.entities=["mock1","mock2"]
    component.type = null;
    component.owner = "bot";
    component.handleSave(form);
    component.owner = "user";
    component.type = "false";
    component.handleSave(form);
    component.owner='';
    component.handleSave(form);
    spyOn(component.eventOutput,"emit");
    //expect(component.stepForm.value.selectedDateRestriction).toEqual("true");
  });

  it('should cancel on call of handleCancel', async () => {

    // const data = { key: "true", selectedDateRestriction: "true" };
    // component.ngOnInit();
    component.handleCancel();
  });

  it("variable change",()=>{
    let formbuilder=new FormBuilder();
    component.stepForm=formbuilder.group([{variables:''}]);
    component.onVariablesChange(["data"]);
    expect(component.variables[0]).toEqual("data");
  })

  it("regexselectchange works",()=>{
    let formbuilder=new FormBuilder();
    component.stepForm=formbuilder.group([{regexVariable:''}]);
    component.onRegexSelectChange({key:"mock"});
    expect(component.regexVariable).toEqual("mock");
  })

  it("onRegexMaskValueToggle",()=>{
    let formbuilder=new FormBuilder();
    component.stepForm=formbuilder.group([{regexBoolMask:''}]);
    component.onRegexMaskValueToggle(true);
    expect(component.regexBoolMask).toBeTruthy();

  })

  it("removevalue function works",()=>{
    let formbuilder=new FormBuilder();
    let form=formbuilder.group([{dynamicButtonsIterableProperty:{ key: '', values: ["mock1","mock2"], staticbuttons: ["mock3","mock4"] },Validators}]);
    component.buildForm(form);
    component.removeValue(1);
  })

  it("remove static button",()=>{
    let formbuilder=new FormBuilder();
    let form=formbuilder.group([{dynamicButtonsIterableProperty:{ key: '', values: ["mock1","mock2"], staticbuttons: ["mock3","mock4"] },Validators}]);
    component.buildForm(form);
    component.removeStaticButton(1);
  })

  it("feedbackTilesUpdate functionality checking",()=>{
    component.feedbackTiles=[];
    let formbuilder=new FormBuilder();
    component.stepForm=formbuilder.group([{feedbackTiles:''}]);
    component.feedbackTilesUpdate({tile:"mock",index:0})
  })

  it("feedbackMessageUpdate functionality working",()=>{
    let formbuilder=new FormBuilder();
    component.stepForm=formbuilder.group([{feedbackReqMsg:''}]);
    component.feedbackMessageUpdate("hi");
  })
})