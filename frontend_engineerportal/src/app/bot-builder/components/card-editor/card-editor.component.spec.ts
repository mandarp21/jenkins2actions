import {CardEditorComponent} from "./card-editor.component";
import {TestBed,inject,ComponentFixture} from "@angular/core/testing";
import {Component,Input} from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs';
import {ConversationService} from "../../services/conversation.service"

@Component({
	selector: 'ce-form-normal ',
	template: '',
})

export class formNoramalMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}


@Component({
	selector: 'ce-form-condition',
	template: '',
})

export class formConditionMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}


@Component({
	selector: 'ce-form-variable',
	template: '',
})

export class formVarableMockComponent {
	@Input() resetVariables;
	@Input() id;
	@Input() boolGreen;
}

@Component({
	selector: 'ce-form-reference',
	template: '',
})

export class ceformReferenceMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}

class conversationServiceMockComponent{
  linkActiveObs:Observable<any>=new BehaviorSubject<any>(null).asObservable();
  setLinkActive(id){

  }
}


describe('Component: AddCardComponent', () => {
  let component: CardEditorComponent;
  let fixture: ComponentFixture<CardEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardEditorComponent,formNoramalMockComponent,formConditionMockComponent,ceformReferenceMockComponent,formVarableMockComponent],providers:[{provide:ConversationService,useClass:conversationServiceMockComponent}]
    });
    fixture = TestBed.createComponent(CardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("card editor component is defined",()=>{
    expect(component).toBeDefined();
  })
  
  it("handle event function",()=>{
    spyOn(component.eventClick, 'emit');
    component.handleEvent({});
  })
})