import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { Component, Input,} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormGroup, Validators ,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { WorkerBotService } from '../../services/worker-bot.service';
import { Observable, observable, BehaviorSubject } from "rxjs"
import { UtilService } from 'src/app/services/util.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerBot } from 'src/app/model/worker-bot';

const masterBot={ botImage:"",botId:"mockId",
botName:"mockName",
botAuthentication: true,
  botLanguage: "en",
  botDefaultBotId: "mockId",
  customerSatisfaction: "",
  escalation:"",
  intentsMatched:"",
  automation:"",
  barChartData: "",
  botTelephoneNumber:"1234"}
class WorkerBotMockService {
	// workerBot$ = Observable.of(response);

	// public updateWorkerBot(): Observable<any> {
	// 	return Observable.of(updatedResponse);
	// }

	public getMasterBot(botID):Observable<any>{
		return Observable.of({})
	}
	public createWorkerBot(payload):Observable<any>{
    let data = new WorkerBot().deserialize({workerBotId:"mockId",workerBotName:"mockName",workerBotDescription:"mockDes"})
return Observable.of(data);
	}
}

class UtilMockService {
  // getSessionStorage(id) {
  //   return 'mockNameFromSession';
	// }
	getAdminFullName(){
		return null
	}
}
@Component({
	selector:"converse-error-panel",
	template:""
})

class MockErrorPanelComponent{
@Input() message;
@Input() closeErrorPanel;
}

@Component({
	selector:"nav-bar",
	template:""
})

class MocknavbarComponent{
@Input() title;
@Input() prevpage;
@Input() backclick;
}

@Component({
	selector:"bot-info-form",
	template:""
})

class MockbotinfoformComponent{
@Input() toggleBotInfoToolTip;
@Input() botType;
@Input() botForm;
}

@Component({
	selector:"converse-nlp-ai-info ",
	template:""
})

class MockconversenlpaiinfoComponent{
@Input() toggleToolTip;
@Input() tooltipKey;
@Input() nlpAIForm;
}

@Component({
	selector:"converse-stt-ai-info",
	template:""
})

class MockconversesttaiinfoComponent{
@Input() toggleToolTip;
@Input() tooltipKey;
@Input() sttAIForm;
}

@Component({
	selector:"converse-tts-ai-info",
	template:""
})

class MockconversettsaiinfoComponent{
@Input() toggleToolTip;
@Input() tooltipKey;
@Input() ttsAIForm;
}

@Component({
	selector:"converse-button",
	template:""
})

class MockconversebuttonComponent{
@Input() val;
@Input() id;
@Input() isDisabled;
@Input() boolGreen;

}

class routeMock{
  queryParams=new BehaviorSubject<any>({masterBotID:"mockId"}).asObservable();
}

class routerMock{
navigate(data){}
}

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateComponent,MockErrorPanelComponent,MockbotinfoformComponent,MockconversebuttonComponent,MockconversenlpaiinfoComponent,MockconversesttaiinfoComponent,MockconversettsaiinfoComponent,MocknavbarComponent],imports:[
        FormsModule,ReactiveFormsModule,RouterTestingModule,ToastrModule.forRoot()],providers:[{provide:WorkerBotService,useClass:WorkerBotMockService},{provide:UtilService,useClass:UtilMockService},ToastrService,{provide:ActivatedRoute,useClass:routeMock},{provide:Router,useClass:routerMock}]
    }).compileComponents();
    fixture = TestBed.createComponent(CreateComponent);
		component = fixture.componentInstance;
  });

 it('CreateComponent should be defined', () => {
	 component.masterBotId="mockId";
	component.workerBotForm=new FormBuilder().group({
			masterBotId: this.masterBotId,
      botName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^(?!\s*$).+/)]],
      botDescription: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      botLanguage: [''],
      botAuthentication: [false],
      NLPProvider: ['', Validators.required],
      STTProvider: [''],
      TTSProvider: [''],
      createdBy:"mockNAme",
      updatedBy: "mockNAme"
		});
	 fixture.detectChanges();
    expect(component).toBeDefined();
	});
	
	it("should save ",inject([Router],(router:Router)=>{
    spyOn(router,"navigate");
		component.workerBotForm=new FormBuilder().group({
			masterBotId: this.masterBotId,
      botName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^(?!\s*$).+/)]],
      botDescription: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      botLanguage: [''],
      botAuthentication: [false],
      NLPProvider: ['', Validators.required],
      STTProvider: [''],
      TTSProvider: [''],
      createdBy:"mockNAme",
      updatedBy: "mockNAme"
		});
    component.save();
   component.backToDashboard();
   component.activateTTBotInfo(true);
   component.back();
	}))
});