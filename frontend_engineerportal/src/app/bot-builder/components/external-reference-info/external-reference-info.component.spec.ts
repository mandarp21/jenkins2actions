import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ExternalRefInfoComponent } from "./external-reference-info.component";
import { Component, Input } from "@angular/core";
import { ConversationService } from "../../services/conversation.service";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { BehaviorSubject, Observable, of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { NodeComponent } from "../node/node.component";

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


class conversationMockService{
  activeExternalRefObs=new BehaviorSubject<any>(null).asObservable();
  getConversationData():Observable<any>{
    return new BehaviorSubject<any>({"channel":"web"})
  }
  listConversationFlows():Observable<any>{
    return of({useCaseId:"mockId",conversationFlowId:"mockId",
      channel:"web",flow:[],exitPoint:"",createdBy:"mock", createdOn:"18-10-2019",updatedBy:"mock",updatedOn:"20-10-2019"})
  }
  hideOverlay(data){}
  hasUnsavedChanges(){
    return true
  }
}
describe('external reference info', () => {
  let component: ExternalRefInfoComponent;
  let fixture: ComponentFixture<ExternalRefInfoComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[ToastrModule.forRoot(),RouterTestingModule],
      declarations: [ExternalRefInfoComponent,ButtonMockComponent],providers:[{provide:ConversationService,useClass:conversationMockService},ToastrService]
    });
    fixture = TestBed.createComponent(ExternalRefInfoComponent);
    component = fixture.componentInstance;
  });

it("should be defined",()=>{
  expect(component).toBeDefined();
})

it("should closeWindow",()=>{
  component.closeWindow();
})

it("should handleclick",()=>{
  component.handleClick(true);
  expect(component.confirmationVisible).toBeTruthy();
})

it("should handleclick",()=>{
  component.handleClick(false);
})
})