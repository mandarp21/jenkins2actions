import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NewBotInfoComponent } from './new-bot-info.component';
import {ReactiveFormsModule, FormBuilder, FormsModule, Validators} from "@angular/forms"
import { Component, Input } from '@angular/core';
import { ToastrModule, ToastrService, } from 'ngx-toastr';

@Component({
  selector:"converse-switch-button",
  template:""
})
export class switchMockComponent{
@Input() disabled
@Input() toggleToolTip
@Input() placement
@Input() tooltipKey
@Input() checked
handleChangeEvent(){}
}

describe('NewBotInfoComponent', () => {
  let component: NewBotInfoComponent;
  let fixture: ComponentFixture<NewBotInfoComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const masterBotFormValues = formBuilder.group(
    {
      botImage: ['',Validators.required],
      botName: ['', Validators.required],
      botDescription: ['', Validators.required],
      botLanguage: [''],
      botAuthentication: false,
      botStatus: false,
      botTelephoneNumber:['',Validators.required]
    }
  );

  //  masterBotForm = {
  //   botId: '123',
  //   botImage: [''],
  //   botName: ['', [Validators.required, Validators.maxLength(30)]],
  //   botDescription: ['', Validators.required],
  //   botLanguage: [''],
  //   botTelephoneNumber: [''],
  //   botAuthentication: [false],
  //   botStatus: [false],
  //   updatedBy: 'abcd',
  //   adminUserId: '1234'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewBotInfoComponent, switchMockComponent],
      imports: [FormsModule, ReactiveFormsModule,ToastrModule.forRoot()],
      providers: [ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBotInfoComponent);
    component = fixture.componentInstance;
    component.botForm = masterBotFormValues;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Description', () => {
    component.botForm.patchValue({
      botImage : null
    })
    component.ngOnInit();
  });

  it('Test Description', () => {
    component.botForm.patchValue({
      botImage : ""
    })
    component.ngOnInit();
  });

  it('should handle bot icon errors properly', () => {
    component.botIconErrorHandler();
    expect(component.botImage).toEqual(null);
    expect(component.isValidUrl).toEqual(false);
  });

  it('should set authentication', () => {
    component.setAutentication(true);
    expect(component.botForm.value.botAuthentication).toEqual(true);
  });

  it('should set status', () => {
    component.setStatus(true);
    expect(component.botForm.value.botAuthentication).toEqual(true);
  });

  it('should mouseleaveImageURL',()=>{
    component.botForm=new FormBuilder().group({botImage:1234})
    component.mouseleaveImageURL()
  })

  it('should mouseleaveTelephone',()=>{
    component.botForm=new FormBuilder().group({botTelephoneNumber:"mock"})
    component.mouseleaveTelephone()
  })

  it('should toggleToolTipBotInfo',()=>{
    component.toggleToolTipBotInfo();
  })
  
});
