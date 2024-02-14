import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { ConversationComponent } from './conversation.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector:"converse-conversation-log",
  template:""
})

export class conversationmockcomponent{
  @Input() botid
}
describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[RouterTestingModule],
      declarations: [ConversationComponent,conversationmockcomponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
  }));

  it('ConversationComponent should be defined', () => {
spyOn(document,"getElementById").and.callFake(()=>{
  let dummy =document.createElement('div');
  dummy.id="notification";
  return dummy;
});
fixture.detectChanges();
    expect(component).toBeDefined();
    component.back();
  });

});