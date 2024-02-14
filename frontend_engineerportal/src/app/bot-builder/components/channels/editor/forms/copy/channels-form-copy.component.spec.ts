import { Component, Input } from '@angular/core';
import { ChannelsFormCopyComponent } from './channels-form-copy.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DropDownComponent } from '../../../../../../shared/component/drop-down/drop-down.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/of';
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
  @Input() hasEmptyOption: boolean;
 @Input() placeholder;
  @Input() copyChannelError
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

describe('copy Channel Form copy Component', () => {

  let fixture: ComponentFixture<ChannelsFormCopyComponent>;
  let comp: ChannelsFormCopyComponent
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      declarations: [ChannelsFormCopyComponent,
        ButtonMockComponent,
        DropDownMockComponent,
      ],
      providers: [
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ChannelsFormCopyComponent);
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

  it('should handle save', async() => {
    fixture.detectChanges();
    const data = "test";
    comp.contentChannels = [{key: 'new-channel'}];
    comp.selectedContentSource = {key: 'new-channel'};
    comp.changeCopyFrom(data);
    expect(comp.selectedContentSource).toEqual(null);

    comp.changeCopyFrom(false);
    let d = { colName: 'Create new channel', key: 'new-channel' };
    expect(comp.contentChannels[0]).toEqual(d);
  });
})
