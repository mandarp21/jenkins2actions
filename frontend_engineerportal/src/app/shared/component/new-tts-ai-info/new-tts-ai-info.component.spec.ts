import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NewTtsAIInfoComponent } from './new-tts-ai-info.component';
import { TTSProvider } from '../../../app-constant';
import { TTSAiConfig } from '../../../model/bot.model';

@Component({
	selector: 'converse-drop-down',
	template: '',
})

export class DropDownMockComponent {
	@Input() placement;
	@Input() id;
	@Input() tooltipKey;
	@Input() activateToolTip;
	@Input() data;
	@Input() selected;
	@Input() disabled;
	@Input() placeholder;
	public onSelchange(event){}
	public update() {
		return true;
	}
}

export const TTS = [
	{ value: 'bingspeech', key: 'Microsoft Bing' },
  { value: 'watson', key: 'Watson Text-To-Speech' },
  { value: 'google', key: 'Google Text-To-Speech' },
  { value: 'polly', key: 'Amazon Polly' },
  { value: 'none', key: 'None' }
];



const ttsAiConfig = [
	{
		provider: 'watson',
		config: {
			username: 'xxx',
			password: 'xxx',
		}
	},
	{
		provider: 'bing',
		config: {
			subscription_key: 'xxx',
		}
	},
	{
		provider: 'polly',
		config: {}
	},{
		provider: 'google',
		config: {}
	}];

const formBuilderConst = new FormBuilder();
const ttsAIFormConst: FormGroup = formBuilderConst.group({ TTSProvider: ['', Validators.required] });

describe('Component: NewTtsAIInfoComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [
				DropDownMockComponent,
				NewTtsAIInfoComponent
			],
			providers: [
				FormBuilder
			]
		});
	});

	it('NewTtsAIInfoComponent property should be on initiate :', () => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		component.ttsAIForm = ttsAIFormConst;
		expect(component.ttsArray).toEqual(TTS);
		expect(component.ttsName).toEqual('TTS');
		expect(component.ttsNameKey).toBeUndefined();
		expect(component.ttsProvider).toBeUndefined();
		expect(component.ttsConfig).toBeUndefined();
	});

it('onSelchange method call with Watson :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		const ttsAIForm: FormGroup = formBuilder.group({ TTSProvider: ['', Validators.required] });
		component.ttsAIForm = ttsAIForm;
		// Should be undefined before change
		expect(component.ttsAIForm.contains('ttsConfig')).toBeFalsy();
		component.onSelchange(TTS[1]);
		fixture.detectChanges();
		expect(component.ttsName).toEqual('Watson Text-To-Speech');
		expect(component.ttsNameKey).toEqual('watson');
		expect(component.ttsAIForm.get('TTSProvider').value).toEqual('watson');
		expect(component.ttsAIForm.contains('ttsConfig')).toBeTruthy();
		component.onSelchange(TTS[0]);
		fixture.detectChanges();
		component.onSelchange({});
		fixture.detectChanges();
		component.ttsProvider = TTSProvider['watson'];
		component.ttsConfig = [];
		ttsAiConfig.forEach((ttsConfig) => {
			component.ttsConfig.push(new TTSAiConfig(ttsConfig['provider'], ttsConfig['config']));
		});
		component.onSelchange(TTS[0]);
		fixture.detectChanges();
	}));

it('onSelchange method call with Watson ttsConfig :', fakeAsync(() => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		component.ttsAIForm = ttsAIFormConst;
		component.ttsProvider = TTSProvider['watson'];
		const ttsConfigChange:SimpleChanges ={ ttsProvider:new SimpleChange({ttsProvider: { currentValue: 'watson', firstChange: false }},{},false)};
		spyOn(component.ttsAIForm, 'removeControl');
		component.ngOnChanges(ttsConfigChange);
		tick();
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			console.log(component.ttsNameKey);
		});
	}));

it('onSelchange method call with Microsoft Bing :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		const ttsAIForm: FormGroup = formBuilder.group({ TTSProvider: ['', Validators.required] });
		component.ttsAIForm = ttsAIForm;
		expect(component.ttsAIForm.contains('ttsConfig')).toBeFalsy();
		component.onSelchange(TTS[0]);
		fixture.detectChanges();
		expect(component.ttsName).toEqual('Microsoft Bing');
		expect(component.ttsNameKey).toEqual('bingspeech');
		expect(component.ttsAIForm.get('TTSProvider').value).toEqual('bingspeech');
		expect(component.ttsAIForm.contains('ttsConfig')).toBeTruthy();
	}));

it('onSelchange method call with Amazon Polly :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		const ttsAIForm: FormGroup = formBuilder.group({ TTSProvider: ['', Validators.required] });
		component.ttsAIForm = ttsAIForm;
		expect(component.ttsAIForm.contains('ttsConfig')).toBeFalsy();
		component.onSelchange(TTS[3]);
		fixture.detectChanges();
		expect(component.ttsName).toEqual('Amazon Polly');
		expect(component.ttsNameKey).toEqual('polly');
		expect(component.ttsAIForm.get('TTSProvider').value).toEqual('polly');
		expect(component.ttsAIForm.contains('ttsConfig')).toBeTruthy();
	}));

	it('onSelchange method call with google :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewTtsAIInfoComponent);
		const component = fixture.componentInstance;
		const ttsAIForm: FormGroup = formBuilder.group({ TTSProvider: ['', Validators.required] });
		component.ttsAIForm = ttsAIForm;
		expect(component.ttsAIForm.contains('ttsConfig')).toBeFalsy();
		component.onSelchange(TTS[2]);
		fixture.detectChanges();
		expect(component.ttsName).toEqual('Google Text-To-Speech');
		expect(component.ttsNameKey).toEqual('google');
		expect(component.ttsAIForm.get('TTSProvider').value).toEqual('google');
		expect(component.ttsAIForm.contains('ttsConfig')).toBeTruthy();
		component.onSelchange({provider:"none"});
	}));
});
