import { Component, Input } from '@angular/core';
import { ChannelsFormAddComponent } from './channels-form-add.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DropDownComponent } from '../../../../../../shared/component/drop-down/drop-down.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  @Input() placeholder;
  @Input() hasEmptyOption: boolean;
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

describe('Channel Form Add Component', () => {

  let fixture: ComponentFixture<ChannelsFormAddComponent>;
  let comp: ChannelsFormAddComponent
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      declarations: [ChannelsFormAddComponent,
        ButtonMockComponent,
        DropDownMockComponent,
      ],
      providers: [
        // FormBuilder,
        // NgxSpinnerService,
        // UtilService,
        // CookieService,
        // ServiceAPIs,
        // WorkerBotService,
        // { provide: ToastrService, useClass: ToastrMockService },
        // { provide: ConversationService, useClass: ConversationMockService },
        //ConversationService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ChannelsFormAddComponent);
    comp = fixture.componentInstance;
    comp.contentChannels = [];
  });

  it('should updated content option', async() => {
    fixture.detectChanges();
    const data = "test";
    comp.onSelectContentOption(data);
    expect(comp.selectedContentOption).toEqual(data);
  });

  it('should updated content source', async() => {
    fixture.detectChanges();
    const data = "test";
    comp.onSelectContentSource(data);
    expect(comp.selectedContentSource).toEqual(data);
  });

  it('should change channel type', async() => {
    fixture.detectChanges();
    const data = "test";
    comp.changeChannelType(data);
    expect(comp.selectedChannelType).toEqual(data);
  });

  it('should handle cancel', async() => {
    fixture.detectChanges();
    spyOn(comp.editorAction, "emit");
    comp.handleCancel();
    expect(comp.editorAction.emit).toHaveBeenCalledWith('close');
  });

  it('should handle save', async() => {
    fixture.detectChanges();
    spyOn(comp.editorAction, "emit");
    comp.handleSave();
    expect(comp.editorAction.emit).toHaveBeenCalled();
  });
})
