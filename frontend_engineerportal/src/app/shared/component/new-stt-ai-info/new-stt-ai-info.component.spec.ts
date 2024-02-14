import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NewSttAIInfoComponent } from './new-stt-ai-info.component';
import { STTProvider } from '../../../app-constant';
import { STTAiConfig } from '../../../model/bot.model';

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

export const STT = [
  { value: 'bingspeech', key: 'Microsoft Bing' },
  { value: 'watson', key: 'Watson Speech-To-Text' },
  { value: 'google', key: 'Google Speech-To-Text' },
  { value: 'none', key: 'None' }
];


const sttAiConfig = [
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
		provider: 'google',
		config: {
			api_key: 'xxx',
		}
	}];

const formBuilderConst = new FormBuilder();
const sttAIFormConst: FormGroup = formBuilderConst.group({ STTProvider: ['', Validators.required] });

describe('Component: NewSttAIInfoComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [
				DropDownMockComponent,
				NewSttAIInfoComponent
			],
			providers: [
				FormBuilder
			]
		});
	});

	it('NewSttAIInfoComponent property should be on initiate :', () => {
		const fixture = TestBed.createComponent(NewSttAIInfoComponent);
		const component = fixture.componentInstance;
		expect(component.sttArray).toEqual(STT);
		expect(component.sttName).toEqual('STT');
		expect(component.sttNameKey).toEqual('');
		expect(component.sttProvider).toBeUndefined();
		expect(component.sttConfig).toBeUndefined();
	});

	it('onSelchange method call with Watson :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewSttAIInfoComponent);
		const component = fixture.componentInstance;
		const sttAIForm: FormGroup = formBuilder.group({ STTProvider: ['', Validators.required] });
		component.sttAIForm = sttAIForm;
		// Should be undefined before change
		expect(component.sttAIForm.contains('sttConfig')).toBeFalsy();
		component.onSelchange(STT[1]);
		fixture.detectChanges();
		expect(component.sttName).toEqual('Watson Speech-To-Text');
		expect(component.sttNameKey).toEqual('watson');
		expect(component.sttAIForm.get('STTProvider').value).toEqual('watson');
		expect(component.sttAIForm.contains('sttConfig')).toBeTruthy();
		component.onSelchange(STT[0]);
		fixture.detectChanges();
		component.onSelchange({});
		fixture.detectChanges();
		component.sttProvider = STTProvider['watson'];
		component.sttConfig = [];
		sttAiConfig.forEach((sttConfig) => {
			component.sttConfig.push(new STTAiConfig(sttConfig['provider'], sttConfig['config']));
		});
		component.onSelchange(STT[0]);
		fixture.detectChanges();
	}));

	it('onSelchange method call with Watson sttConfig :', fakeAsync(() => {
		const fixture = TestBed.createComponent(NewSttAIInfoComponent);
		const component = fixture.componentInstance;
		component.sttAIForm = sttAIFormConst;
		component.sttProvider = STTProvider['watson'];
	 const sttConfigChange:SimpleChanges ={sttProvider:new SimpleChange({sttProvider: { currentValue: 'watson', firstChange: false }},{},false)};
		spyOn(component.sttAIForm, 'removeControl');
		component.ngOnChanges(sttConfigChange);
		tick();
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			console.log(component.sttNameKey);
		});
	}));

it('onSelchange method call with Microsoft Bing :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewSttAIInfoComponent);
		const component = fixture.componentInstance;
		const sttAIForm: FormGroup = formBuilder.group({ STTProvider: ['', Validators.required] });
		component.sttAIForm = sttAIForm;
		expect(component.sttAIForm.contains('sttConfig')).toBeFalsy();
		component.onSelchange(STT[0]);
		fixture.detectChanges();
		expect(component.sttName).toEqual('Microsoft Bing');
		expect(component.sttNameKey).toEqual('bingspeech');
		expect(component.sttAIForm.get('STTProvider').value).toEqual("bingspeech");
		expect(component.sttAIForm.contains('sttConfig')).toBeTruthy();
	}));

	it('onSelchange method call with Google Speech-To-Text :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewSttAIInfoComponent);
		const component = fixture.componentInstance;
		const sttAIForm: FormGroup = formBuilder.group({ STTProvider: ['', Validators.required] });
		component.sttAIForm = sttAIForm;
		expect(component.sttAIForm.contains('sttConfig')).toBeFalsy();
		component.onSelchange(STT[2]);
		fixture.detectChanges();
		expect(component.sttName).toEqual('Google Speech-To-Text');
		expect(component.sttNameKey).toEqual('google');
		expect(component.sttAIForm.get('STTProvider').value).toEqual('google');
		expect(component.sttAIForm.contains('sttConfig')).toBeTruthy();
	}));
});
