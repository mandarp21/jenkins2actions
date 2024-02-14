import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { CEFeedbackReqMsgSectionComponent } from "./ce-section-feedback-req-msg.component";

describe('CE feedback Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CEFeedbackReqMsgSectionComponent,
      ],
      providers: []
    });

    fixture = TestBed.createComponent(CEFeedbackReqMsgSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be defined",()=>{
    expect(component).toBeDefined();
  })

  it("should change message",()=>{
    component.botIconErrorHandler();
    component.ngOnChanges();
    expect(component.message).toEqual("")
    component.messageChange();
  })
})