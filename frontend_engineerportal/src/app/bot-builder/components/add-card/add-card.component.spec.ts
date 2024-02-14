import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddCardComponent } from './add-card.component';
import { Component,Input } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { Observable, BehaviorSubject } from 'rxjs';



@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
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
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCardComponent,ButtonMockComponent],providers:[{provide:ConversationService,useClass:conversationServiceMockComponent}]
    });
    fixture = TestBed.createComponent(AddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('AddCardComponent should be defined', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('Handle click event', () => {
    spyOn(component.eventClick, 'emit');
    component.handleClick('action','link');
  });

  it('Handle end flow', () => {
    spyOn(component.switchEndFlow, 'emit');
    component.endFlowChange();
  });

  it("Handle the changes",()=>{
    component.ngOnChanges();
    expect(component.showLink).toBeFalsy();
  })
});
