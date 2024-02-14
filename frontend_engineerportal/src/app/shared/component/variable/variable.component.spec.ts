import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableComponent } from './variable.component';
import { Component, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
	selector: 'popup-modal',
	template: '',
})
export class PopupModalMockComponent {
  @Input() operation;
  @Input() rejectBtnTxt;
  @Input() type;
  @Input() opener;
  @Input() handleConfirmClickEvent(){};
}

describe('VariableComponent', () => {
  let component: VariableComponent;
  let fixture: ComponentFixture<VariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariableComponent,PopupModalMockComponent],providers:[	NgxSmartModalService]
    }).compileComponents();
    fixture = TestBed.createComponent(VariableComponent);
    component = fixture.componentInstance;
    component.variable={name:"mockname",description:"mockDes",type:"mockType"};
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableComponent);
    component = fixture.componentInstance;
    component.variable={name:"mock",description:"mock",type:"mock"}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    component.variable={id:"mock"};
    component.askToUser();
    component.editVariable();
    component.handleConfirmEvent(true);
  });
  
});
