import { Component, Input, SimpleChanges, SimpleChange} from '@angular/core';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NewNlpAIInfoComponent } from './new-nlp-ai-info.component';
import { NLPProvider } from '../../../app-constant';
import { NLPAiConfig } from '../../../model/bot.model';

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
	public onSelchange(event){}
	public update() {
		return true;
	}
}


const NLP = [
  { value: 'dialogflow_v2', key: 'Google DialogFlow' },
  { value: 'luis', key: 'Microsoft LUIS' },
  { value: 'watson', key: 'IBM Watson Assistant' },
  { value: 'lex', key: 'Amazon Lex' },
  { value: 'rasa', key: 'RASA' },
  { value: 'rhea', key: 'RHEA' },
	{ value: 'alexa', key: 'Amazon Alexa' }
];

const nlpAiConfig = [
	{
		provider: 'dialogflow_v2',
		config: {
			client_email: 'xxx',
			private_key: 'xxx',
			projectId: 'xxx',
			language: 'xxx'
		}
	},
	{
		provider: 'luis',
		config: {
			starter_key: 'xxx',
			app_id: 'xxx',
			api_subscription_key: 'xxx',
      version_id: 'xxx',
      region: 'xxx'
		}
	},
	{
		provider: 'watson',
		config: {
			username: 'xxx',
			password: 'xxx',
			workspace_id: 'xxx',
			region: 'xxx'
		}
	},
	{
		provider: 'lex',
		config: {
			bot_name: 'xxx',
			alias: 'xxx',
			region: 'lex'
		},
		
	},
	{
		provider: 'rasa',
		config: {
			bot_name: 'xxx',
			alias: 'xxx',
			region: 'rasa'
		},
	},
	{
		provider: 'rhea',
		config: {
			bot_name: 'xxx',
			alias: 'xxx',
			region: 'rhea'
		},
	}
]
	;

	// class Simplechange implements SimpleChanges{

	// }
	// const nlpConfigChange ={{nlpProvider:{"previousValue":'dialogflowv2',currentValue:"dialogflow_v1", firstChange: false}},{},region:false}}
	// {
	// 	nlpProvider: { currentValue: 'dialogflow_v2', firstChange: false },
	// 	nlpConfig: {
	// 		currentValue: [
	// 			{
	// 				provider: 'lex', config: { bot_name: 'aa', alias: 'aa' }
	// 			},
	// 			{
	// 				provider: 'dialogflow_v2',
	// 				config: {
	// 					client_email: 'aa',
	// 					private_key: 'ss',
	// 					projectId: 'aa',
	// 					language: 'dd'
	// 				}
	// 			}
	// 		],
	// 		firstChange: false
	// 	}
	// };

const formBuilderConst = new FormBuilder();
const nlpAIFormConst: FormGroup = formBuilderConst.group({ NLPProvider: ['', Validators.required] });

describe('Component: NewNlpAIInfoComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule,FormsModule],
			declarations: [
				DropDownMockComponent,
				NewNlpAIInfoComponent,
			],
			providers: [
				FormBuilder
			]
		});
	});

	it('NewNlpAIInfoComponent property should be on initiate :', () => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		expect(component.nlpArray).toEqual(NLP);
		expect(component.nlpName).toEqual('NLP');
		expect(component.nlpNameKey).toEqual('');
		expect(component.nlpProvider).toBeUndefined();
		expect(component.nlpConfig).toBeUndefined();
	});

	it('onSelchange method call with Dialog Flow:', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		// Should be undefined before change
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[0]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual('Google DialogFlow');
		expect(component.nlpNameKey).toEqual('dialogflow_v2');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('dialogflow_v2');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
		component.onSelchange(NLP[0]);
		fixture.detectChanges();
		component.onSelchange({});
		fixture.detectChanges();
		component.nlpProvider = NLPProvider['dialogflow_v2'];
		component.nlpConfig = [];
		nlpAiConfig.forEach((nlpConfig) => {
			component.nlpConfig.push(new NLPAiConfig(nlpConfig['provider'], nlpConfig['config']));
		});
		component.onSelchange(NLP[0]);
		fixture.detectChanges();
	}));

	it('onSelchange method call with Dialog Flow nlpConfig :', fakeAsync(() => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		component.nlpAIForm = nlpAIFormConst;
		component.nlpProvider = NLPProvider['dialogflow_v2'];
		spyOn(component.nlpAIForm, 'removeControl');
		// component.ngOnChanges(nlpConfigChange);
		tick();
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			console.log(component.nlpNameKey);
		});
	}));

it('onSelchange method call with Microsoft LUIS :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[1]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual('Microsoft LUIS');
		expect(component.nlpNameKey).toEqual('luis');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('luis');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
	}));

	it('onSelchange method call with IBM Watson :', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[2]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual('IBM Watson Assistant');
		expect(component.nlpNameKey).toEqual('watson');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('watson');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
	}));

	it('onSelchange method call with Amazone Lex : ', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[3]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual("Amazon Lex");
		expect(component.nlpNameKey).toEqual('lex');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('lex');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
	}));

	it('onSelchange method call with rasa: ', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[4]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual('RASA');
		expect(component.nlpNameKey).toEqual('rasa');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('rasa');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
	}));

	it('onSelchange method call with rhea : ', inject([FormBuilder], (formBuilder: FormBuilder) => {
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		const nlpAIForm: FormGroup = formBuilder.group({ NLPProvider: ['', Validators.required] });
		component.nlpAIForm = nlpAIForm;
		expect(component.nlpAIForm.contains('nlpConfig')).toBeFalsy();
		component.onSelchange(NLP[5]);
		fixture.detectChanges();
		expect(component.nlpName).toEqual('RHEA');
		expect(component.nlpNameKey).toEqual('rhea');
		expect(component.nlpAIForm.get('NLPProvider').value).toEqual('rhea');
		expect(component.nlpAIForm.contains('nlpConfig')).toBeTruthy();
	}));

	it('onRegchange calls with rhea',inject([FormBuilder],(formBuilder:FormBuilder)=>{
		const fixture = TestBed.createComponent(NewNlpAIInfoComponent);
		const component = fixture.componentInstance;
		component.region="rasa";
		const nlpAIForm: FormGroup = formBuilder.group({provider: 'rasa',
		nlpConfig: {
			bot_name: 'xxx',
			alias: 'xxx',
			region: 'rasa'
		} });
		component.nlpAIForm = nlpAIForm;
		component.onRegchange(NLP[5]);
	}))
});
