/**
 * Unit tests for the Accept Econsent Modal component
 */
import { Component, Input } from '@angular/core';
import { async, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from '../../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import { FormBuilder, Validators,  ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ConfigureComponent } from './configure.component';
import { NewBotInfoComponent } from '../../../shared/component/new-bot-info/new-bot-info.component';
import { BotAIInfoComponent } from '../../../shared/component/bot-ai-info/bot-ai-info.component';
import { MasterBotService } from '../../services/master-bot.service';
import { MasterBot } from '../../../model/master-bot';
import { NgxSmartModalService } from 'ngx-smart-modal';

const testFormFields = {
	botImage: 'https://www.valid.url',
	botName: 'name',
	botDescription: 'desc',
	NLPProvider: 'fsd'
};

const response = {
	masterBotName: '',
  masterBotDescription: '',
  masterBotImage: '',
  masterBotDefaultAuthentication: false,
  createdBy: 'linh.t.nguyen',
  updatedBy: 'linh.t.nguyen',
  NLPProvider: 'watson',
  // NLPConfig: new AiConfig('', ''),
  STTProvider: 'bingspeech',
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
class MasterBotMockService {
	public getMasterBot(data): Observable<any> {
		return Observable.of(response);
	}
	public updateMasterBot(): Observable<any> {
		return Observable.of(updatedResponse);
	}

	public deleteMasterBot():Observable<any>{
		return Observable.of({"result":"success"})
	}
}

const activatedRoute = {
  params: Observable.of({
    id: 'testId'
  }),
};

@Component({
	selector: 'converse-toast-messages',
	template: '',
})

export class ToastMessageMockComponent {
}

@Component({
	selector: 'converse-error-panel',
	template: '',
})

export class ErrorPanelMockComponent {
  @Input() message;
}

@Component({
	selector: 'nav-bar',
	template: '',
})

export class NavBarMockComponent {
  @Input() title;
  @Input() prevpage;
}

@Component({
	selector: 'bot-ai-info',
	template: '',
})

export class BotAIInfoMockComponent {
}

@Component({
	selector: 'bot-info-form',
	template: '',
})
export class BotInfoMockComponent {
}

@Component({
	selector: 'converse-dashboard',
	template: '',
})
export class DashboardMockComponent {
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

const formBuilder: FormBuilder = new FormBuilder();
const masterBotFormValues = formBuilder.group(
	{
		botImage: ['url', [Validators.required, Validators.pattern(/^((http)|(https)):\/\/.+/)]],
		botName: ['mockName', Validators.required],
		botDescription: ['mockDes', Validators.required]
	}
);


describe('configure component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [ReactiveFormsModule,ToastrModule.forRoot(), RouterTestingModule,
				RouterTestingModule.withRoutes(
          [
            { path: 'dashboard', component: DashboardMockComponent },
					])
				],
      declarations: [
				ConfigureComponent,
				NewBotInfoComponent,
				BotAIInfoComponent,
				ToastMessageMockComponent,
				DashboardMockComponent,
				ButtonMockComponent,
				ErrorPanelMockComponent,
				NavBarMockComponent
			],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				FormBuilder,
				UtilService,
				CookieService,
				NgxSmartModalService,
				{ provide: MasterBotService, useClass: MasterBotMockService },
			]
    })
      .compileComponents();
  }));

  it('should render the component successfully', inject([MasterBotService, FormBuilder], (masterBotService: MasterBotService) => {
    const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		comp.masterBotForm = masterBotFormValues;
		spyOn(comp.masterBotForm, 'patchValue');
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
		fixture.detectChanges();
		expect(comp.masterBotId).toEqual('testId');
	}));

	xit('should get master bot and set respective providers', inject([MasterBotService], (masterBotService: MasterBotService) => {
    const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		comp.masterBotForm = masterBotFormValues;
		// masterBotService.getMasterBot('id').subscribe( (response) => {
		// 	comp.STTProvider = response.STTProvider
		// })
		spyOn(masterBotService, 'getMasterBot').and.returnValue({});
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
		fixture.detectChanges();
    expect(comp.STTProvider).toEqual('bing');
	}));

	xit('should navigate to dashboard on click of back', inject([Router, MasterBotService], (router: Router, masterBotService: MasterBotService) => {
    const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		comp.masterBotForm = masterBotFormValues;
    spyOn(router, 'navigate');
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
		comp.back();
		expect(router.navigate).toHaveBeenCalledWith(['dashboard']);		
	}));

	it('should navigate to masterbot performance page on click of performance arrow', inject([Router], (router: Router) => {
    const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		spyOn(router, 'navigate');
		comp.masterBotId = 'mockId'
		comp.navigateToBotPerformance();
		expect(router.navigate).toHaveBeenCalledWith(['masterbot', 'mockId', 'performance']);		
	}));

	xit('should update masterbot', inject([MasterBotService], (masterBotService: MasterBotService) => {
    const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		const payload = {
			botImage: 'https://ds',
			botName: 'Name',
			botDescription: 'desc',
			NLPProvider: 'NLP'
		};
		// masterBotService.updateMasterBot(payload).subscribe( (response) => {
		// 	comp.masterBot.up = response.STTProvider
		// })
		spyOn(masterBotService, 'updateMasterBot').and.returnValue({});
		fixture.detectChanges();
		comp.masterBot = new MasterBot();
		spyOn(comp.masterBot, 'mapToUpdateApi');
		comp.update();
		expect(comp.masterBot.updatedBy).toEqual('manasa.majji');
	}));

	it("should update",()=>{
		const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		comp.masterBotForm=masterBotFormValues;
		let data=new MasterBot().deserialize({botImage:"mockId",botDescription:"mockName",botName:"mockName"});
		comp.masterBot=data;
comp.update();
expect(comp.masterBot.NLPProvider).toEqual("watson")
	})

	it("should handle confirm event",()=>{
		const fixture = TestBed.createComponent(ConfigureComponent);
		const comp = fixture.componentInstance;
		comp.masterBotId="masterBotId";
comp.handleConfirmEvent(true);
comp.toggleEditSectionToolTip(true);
expect(comp.toolTipFlag).toEqual(true);
comp.closeErrorPanel();
comp.askToUser();
	})
});