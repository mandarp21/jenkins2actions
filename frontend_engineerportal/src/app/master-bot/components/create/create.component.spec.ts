import { Component, Input } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CreateComponent } from './create.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NewBotInfoComponent } from '../../../shared/component/new-bot-info/new-bot-info.component';
import { NewNlpAIInfoComponent } from '../../../shared/component/new-nlp-ai-info/new-nlp-ai-info.component';
import { DropDownComponent } from '../../../shared/component/drop-down/drop-down.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MasterBotService } from '../../services/master-bot.service';
import { Observable, of, observable ,throwError} from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import 'rxjs/add/observable/of';


class MasterBotMockService {
	createMasterBot(payload: any): Observable<any> {
	return Observable.of({
		botId: '1234'
	});

}
}


@Component({
	selector: 'bot-info-form ',
	template: '',
})

export class BotInfoFormComponent {
	@Input() wideBotInfoCard
	@Input() botType
	@Input() botForm
}

@Component({
	selector: 'converse-stt-ai-info',
	template: '',
})

export class SttAIInfoMockComponent {
	@Input() sttAIForm
}

@Component({
	selector: 'converse-tts-ai-info',
	template: '',
})

export class TtsAIInfoMockComponent {
	@Input() ttsAIForm
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

describe('Create Master Bot Component', () => {
	let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [ReactiveFormsModule, RouterTestingModule,  ToastrModule.forRoot()],
			declarations: [CreateComponent,
				NewNlpAIInfoComponent,
				NavBarMockComponent,
				SttAIInfoMockComponent,
				TtsAIInfoMockComponent,
				ErrorPanelMockComponent,
				ButtonMockComponent,BotInfoFormComponent
			],
			providers: [
				FormBuilder,
				UtilService,
				CookieService,
				{ provide: MasterBotService, useClass: MasterBotMockService }
			]
		});
	});

	it('should mark the form invalid when invaid image is passed', () => {
		const testFormFields = {
			botImage: 'invalid url for image',
			botName: 'name',
			botDescription: 'desc',
			NLPProvider: 'fsd'
		};
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		expect(comp).toBeDefined();
		// fixture.whenStable().then(() => {
		// 	comp.masterBotForm.controls['botImage'].setValue(testFormFields.botImage);
		// 	comp.masterBotForm.controls['botName'].setValue(testFormFields.botName);
		// 	comp.masterBotForm.controls['botDescription'].setValue(testFormFields.botDescription);
		// 	comp.masterBotForm.controls['NLPProvider'].setValue(testFormFields.NLPProvider);
		// 	expect(comp.masterBotForm.valid).toBeFalsy();
		// });
	});

	it('should mark the form invalid when bot name is empty', () => {
		const testFormFields = {
			botImage: 'https://ds',
			botName: '',
			botDescription: 'desc',
			NLPProvider: 'fsd'
		};
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			comp.masterBotForm.controls['botImage'].setValue(testFormFields.botImage);
			comp.masterBotForm.controls['botName'].setValue(testFormFields.botName);
			comp.masterBotForm.controls['botDescription'].setValue(testFormFields.botDescription);
			comp.masterBotForm.controls['NLPProvider'].setValue(testFormFields.NLPProvider);
			expect(comp.masterBotForm.valid).toBeFalsy();
		});
	});

	it('should mark the form invalid when NLP Provider is not selected', () => {
		const testFormFields = {
			botImage: 'https://ds',
			botName: 'Name',
			botDescription: 'desc',
			NLPProvider: '',
		};
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			comp.masterBotForm.controls['botImage'].setValue(testFormFields.botImage);
			comp.masterBotForm.controls['botName'].setValue(testFormFields.botName);
			comp.masterBotForm.controls['botDescription'].setValue(testFormFields.botDescription);
			comp.masterBotForm.controls['NLPProvider'].setValue(testFormFields.NLPProvider);
			expect(comp.masterBotForm.valid).toBeFalsy();
		});
	});

	it('should mark the form valid when all mandatory fields are filled in desired format', () => {
		const testFormFields = {
			botImage: 'https://ds.com',
			botName: 'Name',
			botDescription: 'desc',
			botLanguage: ['en-us'],
      botTelephoneNumber:"0123456789",
      botAuthentication: [false],
			NLPProvider: 'NLP',
			STTProvider: [''],
      TTSProvider: [''],
      createdBy:"mock man",
      updatedBy: "mock man"
		};
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			comp.masterBotForm.controls['botImage'].setValue(testFormFields.botImage);
			comp.masterBotForm.controls['botName'].setValue(testFormFields.botName);
			comp.masterBotForm.controls['botDescription'].setValue(testFormFields.botDescription);
			comp.masterBotForm.controls['botLanguage'].setValue(testFormFields.botLanguage);
			comp.masterBotForm.controls['botTelephoneNumber'].setValue(testFormFields.botTelephoneNumber);
			comp.masterBotForm.controls['botAuthentication'].setValue(testFormFields.botAuthentication);
			comp.masterBotForm.controls['NLPProvider'].setValue(testFormFields.NLPProvider);
			comp.masterBotForm.controls['STTProvider'].setValue(testFormFields.STTProvider);
			comp.masterBotForm.controls['TTSProvider'].setValue(testFormFields.TTSProvider);
			comp.masterBotForm.controls['createdBy'].setValue(testFormFields.createdBy);
			comp.masterBotForm.controls['updatedBy'].setValue(testFormFields.updatedBy);
			expect(comp.masterBotForm.valid).toBeTruthy();
		});
	});

	it('should redirect to dashboard on click of back button', inject([Router], (router: Router) => {
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		spyOn(router, 'navigate');
		comp.back();
		expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
	}));


	it('should invoke create master bot service on click of save', inject([MasterBotService], (masterBotService: MasterBotService) => {
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		const payload = {
			"NLPConfig": {"config": {}, "provider": ""}, "NLPProvider": "", "createdBy": "linh.t.nguyen", "masterBotDefaultAuthentication": false, "masterBotDescription": "", "masterBotImage": "", "masterBotName": "", "updatedBy": "linh.t.nguyen"
		};
		spyOn(comp.masterBot, 'mapToPostApi');
		// spyOn(masterBotService, 'createMasterBot');
		comp.save();
		comp.closeErrorPanel();
		comp.toggleInfoToolTipHandler();
	}));

	it('should invoke create master bot service on click of save', inject([MasterBotService], (masterBotService: MasterBotService) => {
		const fixture = TestBed.createComponent(CreateComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		const payload = {
			"NLPConfig": {"config": {}, "provider": ""}, "NLPProvider": "", "createdBy": "linh.t.nguyen", "masterBotDefaultAuthentication": false, "masterBotDescription": "", "masterBotImage": "", "masterBotName": "", "updatedBy": "linh.t.nguyen"
		};
		comp.save();
	}));
})