import { Component, Input } from '@angular/core';
import { CEConditionFormComponent } from './ce-form-condition.component';
import { TestBed, inject } from '@angular/core/testing';
import { CompilerFactory, Compiler } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { ConversationService } from '../../../../services/conversation.service';
import { UtilService } from '../../../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { ServiceAPIs } from '../../../../../core/services/service-apis.service';
import { ToastrService } from 'ngx-toastr';
import { of, Observable } from 'rxjs';
// import { InputAutocomplete } from '../../../../../bot-builder/components/input-autocomplete/input-autocomplete.component';

@Component({
  selector: 'input-autocomplete',
  template: '',
})

export class InputAutocompleteMock {
  @Input() message;
  @Input() placeholder;
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
  @Input() hasEmptyOption: boolean;
  @Input() placeholder;
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

class ToastrMockService {

}

let router: Router;
let util: UtilService;
let compiler: Compiler;
let active: ActivatedRoute;
let conv: ConversationService;
let work: WorkerBotService;

describe('CE Form Condition Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [CEConditionFormComponent,
        DropDownMockComponent,
        InputAutocompleteMock,
        customValueMockComponent,
        // NavBarMockComponent,
        // TestChatMockComponent,
         ButtonMockComponent,
      ],
      providers: [
       UtilService,
       CookieService,
       WorkerBotService,
        ServiceAPIs,
        { provide: ToastrService, useClass: ToastrMockService },
        //{ provide: ConversationService, useClass: ConversationMockService} ,
        ConversationService,
      ]
    });

    fixture = TestBed.createComponent(CEConditionFormComponent);
    component = fixture.componentInstance;  
  });


  it('Component to be defined', async () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeDefined();
  });

  it('should build form', async () => {
    fixture.detectChanges();
    const data={
      title: "test",
      conditionType: "none",
      intent: "int",
      entities: "ent",
      conditionStatement: "dummy_condition",

    }
    component.buildForm(data);
    expect(component.conditionStatement).toEqual(data.conditionStatement);
    expect(component.entities).toEqual(data.entities);
    expect(component.intent).toEqual(data.intent);
    expect(component.conditionType).toEqual(data.conditionType);
    expect(component.conditionDescription).toEqual(data.title);
  });

  it('should set intent or entities', async () => {
    let type = "intent";
    let data = {key: "test"}
    component.buildForm();
    component.onSelChangeUser(type, data);
    expect(component.conditionForm.value.intent).toEqual("test");

    type = "entities"
    component.onSelChangeUser(type, "entity_test");
    expect(component.conditionForm.value.entities).toEqual("entity_test");
  });

  it('should update condition statemnet in form', async () => {
    let data = "dummy_value";
    component.buildForm();
    component.changeConditionStatement(data);
    expect(component.conditionForm.value.conditionStatement).toEqual(data);
  });

  it('should save', async () => {
    let data = "dummy_value";
    spyOn(component.eventOutput, "emit");
    component.handleSave(data);
    expect(component.eventOutput.emit).toHaveBeenCalledWith({
      action: 'saveCondition',
      form: data
    });
  });

  it('should cancel', async () => {
    let data = "dummy_value";
    spyOn(component.eventOutput, "emit");
    component.handleCancel(data);
    expect(component.eventOutput.emit).toHaveBeenCalledWith({
      action: 'closeSideBar',
    });
  });
});