import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { CEFeedbackTilesSectionComponent } from "./ce-section-feedback-tiles.component";

describe('CE feedback tiles Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CEFeedbackTilesSectionComponent,
      ],
      providers: []
    });

    fixture = TestBed.createComponent(CEFeedbackTilesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it("should be defined",()=>{
  expect(component).toBeDefined();
})

it("should change title",()=>{
  component.tiles=[];
  component.tileChange(0,"data");
  component.ngOnChanges();
})
})