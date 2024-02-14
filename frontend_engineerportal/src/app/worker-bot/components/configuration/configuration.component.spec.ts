/**
 * Unit tests for the Accept Econsent Modal component
 */
import { Component, Input } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from '../../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import { FormBuilder, Validators,  ReactiveFormsModule } from '@angular/forms';

import { ConfigurationComponent } from './configuration.component';
import { WorkerBotService } from '../../services/worker-bot.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { UtilService } from 'src/app/services/util.service';
import { WorkerBot } from 'src/app/model/worker-bot';

const testFormFields = {
	botImage: 'https://www.valid.url',
	botName: 'name',
	botDescription: 'desc',
	NLPProvider: 'fsd'
};

const response = {
	masterBotName: '',
  masterBotDescription: '',
  masterBotId: 'test',
  requireAuthentication: false,
  botLanguage: 'en',
  associatedIntents: ['test'],
  associatedEntities: ['AE'],
  createdBy: 'linh.t.nguyen',
  updatedBy: 'linh.t.nguyen',
  NLPProvider: 'watson',
  // NLPConfig: new AiConfig('', ''),
  STTProvider: 'bing',
  // STTConfig: new AiConfig('', ''),
  TTSProvider: 'polly',
	// TTSConfig: new AiConfig('', ''),
}

const updatedResponse = {
	masterBotName: '',
  masterBotDescription: '',
  masterBotImage: '',
  masterBotDefaultAuthentication: false,
  createdBy: 'linh.t.nguyen',
  updatedBy: 'manasa.majji',
  NLPProvider: 'watson',
  // NLPConfig: new AiConfig('', ''),
  STTProvider: 'bing',
  // STTConfig: new AiConfig('', ''),
  TTSProvider: '',
	// TTSConfig: new AiConfig('', ''),
	mapToUpdateApi() {
		return {};
	}
}

const newvalues = {
	botImage: 'https://www.valid.url',
	botName: 'name',
	botDescription: 'desc',
}

const store = {};
const mockSessionStorage = {
	setItem: (key: string, value: string) => {
		store[key] = `${value}`;
	},
}
class WorkerBotMockService {
	workerBot$ = Observable.of(response);

	public updateWorkerBot(): Observable<any> {
		return Observable.of(updatedResponse);
  }
  public getListIntents():Observable<any>{
  return Observable.of([response])
  }

  public deleteWorkerBot(data):Observable<any>{
return Observable.of({data:"mockdata"})
  }
  public publishWorkerBot(data){}
}


class UtilMockService {
  getAdminFullName(){
    return "MockName"
  }
  getSessionStorage(botId){
  return (null)
  }
  sortArray(){
  return [{intentName:"mock1",selected:false},{intentName:"mock2",selected:false}]
  }
  }

const activatedRoute = {
  parent: {
    snapshot: {
      paramMap: {
        get() {
          return 'testId';
        }
      }
    }
  }
};

@Component({
	selector: 'converse-nlp-ai-info',
	template: '',
})

export class NlpAIInfoMockComponent {
  @Input() tooltipKey;
  @Input() toggleToolTip;
  @Input() nlpAIForm;
  @Input() nlpProvider;
  @Input() nlpConfig;
}

@Component({
	selector: 'converse-error-panel',
	template: '',
})

export class ErrorPanelMockComponent {
  @Input() message;
}

@Component({
	selector: 'converse-stt-ai-info',
	template: '',
})

export class SttAIInfoMockComponent {
  @Input() tooltipKey;
  @Input() toggleToolTip;
  @Input() sttAIForm;
  @Input() sttProvider;
  @Input() sttConfig;
}

@Component({
	selector: 'converse-tts-ai-info',
	template: '',
})

export class TtsAIInfoMockComponent {
  @Input() tooltipKey;
  @Input() toggleToolTip;
  @Input() ttsAIForm;
  @Input() ttsProvider;
  @Input() ttsConfig;
}

@Component({
	selector: 'bot-info-form',
	template: '',
})
export class BotInfoMockComponent {
  @Input() botType;
  @Input() botForm;
  @Input() toggleBotInfoToolTip;
  @Input() botStatusVisiblity;
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
  @Input() isDisabled;
	public update() {
		return true;
	}
}

@Component({
	selector: 'converse-configure-associated-intents',
	template: '',
})
export class AssociatedIntentsMockComponent {
  @Input() intentListEmitter;
  @Input() intentsList;
}

@Component({
	selector: 'popup-modal',
	template: '',
})
export class PopupModalMockComponent {
  @Input() opener;
  public handleConfirmEvent(event){
  }
}


const formBuilder: FormBuilder = new FormBuilder();
const workerBotFormValues = formBuilder.group(
	{
		botImage: ['', [Validators.required, Validators.pattern(/^((http)|(https)):\/\/.+/)]],
		botName: ['', Validators.required],
    botDescription: ['', Validators.required],
    NLPProvider:["luis"]
	}
);

class routerMock{
  navigate(data1){
return true
  }
}

describe('Configuration Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,ToastrModule.forRoot()
				],
      declarations: [
        NlpAIInfoMockComponent,
        SttAIInfoMockComponent,
        TtsAIInfoMockComponent,
				BotInfoMockComponent,
				ButtonMockComponent,
        ErrorPanelMockComponent,
        AssociatedIntentsMockComponent,
        ConfigurationComponent,PopupModalMockComponent
			],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
			  FormBuilder,{provide:Router,useClass:routerMock},
				{ provide: WorkerBotService, useClass: WorkerBotMockService },ToastrService,{provide:UtilService,useClass:UtilMockService}
			]
    })
      .compileComponents();
  });

  it('should get worker bot id and worker bot info', () => {
    const fixture = TestBed.createComponent(ConfigurationComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(comp.workerBotId).toEqual('testId');
      expect(comp.workerBot).toEqual(response);
    })
  });
  
  it('should update worker bot', () => {
    const fixture = TestBed.createComponent(ConfigurationComponent);
    const comp = fixture.componentInstance;
    comp.workerBotForm = workerBotFormValues;
    comp.workerBot=new WorkerBot().deserialize({workerBotCurrentNLPProvider:"luis",workerBotNLPConfig:[{provider:"watson",config:{}}]},true)
		comp.update();
  }); 

  it('should close error panel on click of close', () => {
    const fixture = TestBed.createComponent(ConfigurationComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.closeErrorPanel();
    comp.buildIntentList(['test']);
    fixture.whenStable().then(()=>{
      // expect(comp.associatedIntents[0]).toEqual('test');
      expect(comp.errorOnSave).toEqual(false);
    }
    )
 
  });

  it('should handle confirm event', inject([Router], (router: Router) => {
    const fixture = TestBed.createComponent(ConfigurationComponent);
    const comp = fixture.componentInstance;
    comp.workerBotId="mockId";   
    new WorkerBot().masterBotId="mockId";
    comp.handleConfirmEvent(true);
    comp.toggleToolTipBotInfo(true);
    comp.askToUser();
    expect(comp.askToDelete).toBeTruthy();
  }));
  
});