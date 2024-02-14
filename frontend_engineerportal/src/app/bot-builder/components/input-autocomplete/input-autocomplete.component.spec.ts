import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { InputAutocompleteComponent} from './input-autocomplete.component';
import { Pipe, PipeTransform } from '@angular/core';
import { compileComponentFromMetadata } from '@angular/compiler/src/render3/view/compiler';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../services/conversation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceAPIs } from '../../../core/services/service-apis.service';
import { WorkerBotService } from '../../../worker-bot/services/worker-bot.service'
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { CookieService } from 'ngx-cookie-service';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform() {}
}

class ToastrMockService{
22
}

describe('Component: InputAutoComponent', () => {
  let component: InputAutocompleteComponent;
  let fixture: ComponentFixture<InputAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputAutocompleteComponent, TruncatePipe],
      imports: [FormsModule, HttpClientModule],
      providers:[ConversationService,
        ServiceAPIs,
        WorkerBotService,
        { provide : ToastrService, useClass : ToastrMockService},UtilService,CookieService
      ]
    });
    fixture = TestBed.createComponent(InputAutocompleteComponent);
    component = fixture.componentInstance;
   // const pipe = new TruncatePipe();
  });

  it(' should be defined', () => {
    expect(component).toBeDefined();
  });

  it(' should get intent list on initialisation',inject([ConversationService],(conversationService: ConversationService) => {
    spyOn(conversationService,"variablesListObs"). and.returnValues(of([]));
    spyOn(conversationService,"variableDetailsObs"). and.returnValues(of([{type:"mocktype1"}]));
    component.variableTypes=[{name:"mockName"}]
    component.ngOnInit();
    expect(component.variablesOptions).toEqual([]);
  }));

  it(' should get value when input changes',inject([ConversationService],(conversationService: ConversationService) => {
    // spyOn(conversationService, "apiOptionsObs"). and.returnValues(of([{value: "test"}]));
    let data = "test@demo"
    component.variablesOptions = ["test", "demo"];
    component.onInput(data);
    expect(component.visibleVariables).toEqual(["demo"]);

    data = "test";
    component.onInput(data);
    expect(component.visibleVariables).toEqual([]);

  }));

  it(' should get intent list on initialisation',inject([ConversationService],(conversationService: ConversationService) => {
    let variable = "type";
    component.message = "old_text@test";
    spyOn(component.inputChange, "emit");
    component.variableTypes={type:'API'};
    component.variableDetails=[{type:'API',config:{"success":true},name:"type"}];
    component.onVariableSelect(variable);
  }));

  it(' should get intent list on variable select second option',inject([ConversationService],(conversationService: ConversationService) => {
    let variable = "type";
    component.onVariableSelectSecondOption(variable);
  }));


  it(' should emit on any variable change',inject([ConversationService],(conversationService: ConversationService) => {
    component.message = "message_test"
    spyOn(component.inputChange, "emit")
    component.onChange();
    expect(component.inputChange.emit).toHaveBeenCalledWith(component.message);
  }));
});
