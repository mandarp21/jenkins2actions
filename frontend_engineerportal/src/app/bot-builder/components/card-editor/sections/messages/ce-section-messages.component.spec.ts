import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { CEMessagesSectionComponent } from "./ce-section-messages.component";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'input-autocomplete',
  template: '',
})

export class InputAutocompleteMock {
  @Input() message;
  @Input() placeholder;
  @Input() type;
  @Input() id;
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
  @Input() activateColors;
  @Input() rounded;
}


describe('CE feedback tiles Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CEMessagesSectionComponent,InputAutocompleteMock,ButtonMockComponent],
      providers: []
    });

    fixture = TestBed.createComponent(CEMessagesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be defined",()=>{
    expect(component).toBeDefined();
  })

  it("should change message",()=>{
    component.messages=[{data:"mockData"}];
    component.ngOnChanges();
    component.changeMessages(0,"data");
  })
})