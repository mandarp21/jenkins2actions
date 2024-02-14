import { Component, Input } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { UseCases } from 'src/app/model/use-cases';
import { ConversationFilterComponent } from './conversation-filter.component';
import { componentFactoryName } from '@angular/compiler';

let data={
  useCaseId: "mockId",
  useCaseName:"mockName",
  useCaseDescription: "",
  useCaseStatus:"",
  createdBy:"mock",
  updatedBy: "mock",
  createdOn: "18-10-2019",
  updatedOn: "20-10-2019",
  averageHumanHandlingTime: "100",
  collectFeedback: false,
  useCaseChannel:["web","skype"],
  isEditable: false,
  conversationType: ""
}
let usecase=new UseCases().deserialize(data);
@Component({
	selector: 'converse-textbox',
	template: '',
})

export class ConverseTextBoxMockComponent {
	@Input() val;
	@Input() id;
	@Input() placeholder;
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ConverseButtonMockComponent {
  @Input() id;
	@Input() val;
  @Input() boolGreen;
  @Input() isDisabled;
}

describe('Conversastion filter Component : shared', () => {
  let comp: ConversationFilterComponent;
  let fixture: ComponentFixture<ConversationFilterComponent>;
	beforeEach(async () => {
		TestBed.configureTestingModule({
      declarations: [
        ConversationFilterComponent,
        ConverseButtonMockComponent,ConverseTextBoxMockComponent]
		    })		;
    fixture = TestBed.createComponent(ConversationFilterComponent);
		comp = fixture.componentInstance;
	})

	it("should be defined",()=>{
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true}];
		fixture.detectChanges();
		expect(comp).toBeDefined();
	});

	it("should close dialog",()=>{
		comp.selectedList=[];
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true}];
		comp.closeDialog();
	})

	it("should reset dialog",()=>{
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true}];
		comp.resetDialog();
	})

	it("should filter items",()=>{
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true,value:"Select All"}];
		comp.itemSelection({value:"Select All"});
	});

	it("should select items",()=>{
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true,value:"Select All"},{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true,value:"Select All"}];
		comp.itemSelection({value:"Select All"});
	});

	it("should filter item",()=>{
    comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320,selected:true,value:"Select All"}];
		comp.filterItems("q");

	})
})