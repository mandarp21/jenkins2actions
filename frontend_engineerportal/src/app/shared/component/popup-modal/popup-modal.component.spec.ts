import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupModalComponent } from './popup-modal.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Component, Input } from '@angular/core';

class ngxsmartmockService{
  getModal(data){
    return true
  }
}

@Component({
  selector:"ngx-smart-modal",template:""
})
export class ngSmartModalMOck{
  @Input() escapable
  @Input() dismissable
  @Input() identifier

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

describe('PopupModalComponent', () => {
  let component: PopupModalComponent;
  let fixture: ComponentFixture<PopupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[{provide:NgxSmartModalService,useClass:ngxsmartmockService}],
      declarations: [PopupModalComponent,ngSmartModalMOck,ButtonMockComponent]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.opener=true;
    component.modalInsatance={open:()=>{},close:()=>{}}
    expect(component).toBeDefined();
    component.ngOnChanges();
    component.deleteConfirmed(true);
  });
});
