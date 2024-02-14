import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from "@angular/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { WorkerBotService } from "src/app/worker-bot/services/worker-bot.service";
import { CustomValuesListComponent } from "./custom-values-list.component";
import { BehaviorSubject } from "rxjs";
import { FormsModule } from "@angular/forms";

class workerBotMockService{

  entityListValuesObs=new BehaviorSubject<any>(null).asObservable();
}


@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}

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
  @Input() ceFormVariableTypeError;
  @Input() ceFormMethodError;
  @Input() ceFormValueType;
}

describe('Custom value list', () => {
  let component: CustomValuesListComponent;
  let fixture: ComponentFixture<CustomValuesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[ToastrModule.forRoot(),FormsModule],declarations:[CustomValuesListComponent,ButtonMockComponent,DropDownMockComponent],
      schemas:[CUSTOM_ELEMENTS_SCHEMA],providers:[{provide:WorkerBotService,useClass:workerBotMockService},ToastrService]
    });
    fixture = TestBed.createComponent(CustomValuesListComponent);
    component = fixture.componentInstance;  
  });

  it("should be defined",()=>{
    expect(component).toBeDefined();
  });

it("should detect changes",()=>{
  component.selected={"data":"mock"};
  component.ngOnChanges();
  expect(component.inputOpen).toBeFalsy();
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.removeSelected(2);
  expect(component.selected).toBeNull;
})

it("should save input",()=>{
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.type="entity";
  component.entityName="";
  component.isFormUnfinished();
  component.saveInput();
})

it("should save input",()=>{
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.type="entity";
  component.entityName="mock";
  component.entityValue="mockValue";
  component.entityPrompt="mockPrompt";
  component.isFormUnfinished();
  component.saveInput();
})

it("should save input",()=>{
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.type="entity-condition";
  component.entityName="mock";
  component.entityValue="mockValue";
  component.entityPrompt="mockPrompt";
  component.isFormUnfinished();
  component.saveInput();
})

it("should save input",()=>{
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.type="apiSuccess";
  component.entityName="mock";
  component.title="mockValue";
  component.path="mockPath";
  component.isFormUnfinished();
  component.saveInput();
})

it("should save input",()=>{
  component.selected=[{"data":"mock"},{"data2":"mock"},{"data3":"mock"}];
  component.type="variables";
  component.entityName="mock";
  component.variable="mockValue";
  component.isFormUnfinished();
  component.saveInput();
})


it("should add button click",()=>{
component.inputOpen=false;
  component.addButtonClick();
expect(component.inputOpen).toBeTruthy();
})

it("should changeSelectedItem",()=>{
  component.changeSelectedItem({key:"mockKey"},"entityName");
})

it("should getDropdownData",()=>{
  component.getDropdownData("entityName");
  expect(component.getDropdownData).not.toThrow();
})

it("should getDropdownData",()=>{
  component.getDropdownData("entityValue");
  expect(component.getDropdownData).not.toThrow();
})

})