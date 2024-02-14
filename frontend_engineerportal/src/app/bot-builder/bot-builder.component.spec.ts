import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BotBuilderComponent } from './bot-builder.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Component: BotBuilderComponent', () => {
  let component: BotBuilderComponent;
  let fixture: ComponentFixture<BotBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BotBuilderComponent]
    });
    fixture = TestBed.createComponent(BotBuilderComponent);
    component = fixture.componentInstance;
  });
  it('ConversationFlowManagerComponent should be defined', () => {
    expect(component).toBeDefined();
  });
});

