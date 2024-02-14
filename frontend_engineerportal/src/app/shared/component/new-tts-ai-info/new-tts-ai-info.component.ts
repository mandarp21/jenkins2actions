import { Component, OnInit, Input, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TTS, TTSProvider } from '../../../app-constant';
import { TTSAiConfig, TTSBing, TTSAmazonPolly, TTSWatson, TTSGoogle } from '../../../model/bot.model';

@Component({
	selector: 'converse-tts-ai-info',
	styleUrls: ['new-tts-ai-info.component.sass'],
	templateUrl: 'new-tts-ai-info.component.html'
})
/**
 * @description A TTS configuration component used to create/edit TTS AI Info based on the TTS selected
 * @param {Array<any>} ttsArray - List of TTS can be configured
 * @param {string} ttsName - Name of the tts currently selected
 * @param {string} ttsNameKey - Key corresponding the currently selected TTS
 * @param {string} dropwidth - width of the dropdowm
 * @param {string} iconcaret - type of the icon
 * @param {FormGroup} ttsAIForm - referance of the FormGroup
 * @param {TTSProvider} ttsProvider - TTS value received in case of the edit TTS AI info
 * @param {Array<TTSAiConfig>} ttsConfig - Array of the TTS config objects in case of the edit TTS AI info *
 * @param {boolean} toggleToolTip - flag to set the tooltip on hover of dropdown control
 * @param {string} tooltipKey - key to fetch the tooltip text from config file
*/
export class NewTtsAIInfoComponent implements OnInit, OnChanges, DoCheck {

	ttsArray: any[];
	ttsName: string;
	ttsNameKey: string;
	dropwidth: string;
	iconcaret: string;
	@Input() ttsAIForm: FormGroup;
	@Input() ttsProvider: TTSProvider;
	@Input() ttsConfig: Array<TTSAiConfig>;
  @Input() toggleToolTip: boolean;
  @Input() tooltipKey: string;

	constructor(private formBuilder: FormBuilder) {
		this.ttsArray = TTS;
		this.ttsName = 'TTS';
		this.dropwidth = '15em';
		this.iconcaret = 'caret';
	}

	ngOnInit() {
		this.ttsAIForm.get('TTSProvider').valueChanges
			.subscribe((value: string) => {
				if (!value) {
					this.ttsName = 'TTS';
					this.ttsNameKey = '';
				}
			});
	}

	/**
	 * @description - Angular Lifecycle hook, invoked on input property change
	 * @param {SimpleChanges} changes - Defines an object that associates properties with instances of SimpleChange.
	 * @return void
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['ttsProvider'] &&
			changes['ttsProvider'].previousValue !== changes['ttsProvider'].currentValue
		) {
			setTimeout(() => {
				this.ttsNameKey = this.ttsProvider;
				this.ttsName = (this.ttsNameKey) ? TTS.find((obj) => {
					return (obj.value).toLowerCase() === this.ttsNameKey.toLowerCase();
				}).key : 'TTS';
				this.changeAIFormControls(this.ttsNameKey);
				this.patchAIFormControlValues(this.ttsConfig, this.ttsProvider);
			}, 0);
		}
	}

	ngDoCheck(): void {
		if (this.ttsAIForm.contains('ttsConfig') && this.ttsName === 'TTS' && this.ttsNameKey === '') {
			this.ttsAIForm.removeControl('ttsConfig');

		}
	}

	/**
	 * @description - Method ttsConfigured() - To get tts config object for provider if configured
	 * @param {Array<AiConfig>} nlpConfig -  Array of tts config objects, Already configured
	 * @param {TTSProvider} ttsProvider - Currently selected tts Provider
	 * @return {TTSBing | TTSAmazonPolly | TTSWatson } - tts config object
	 */
	ttsConfigured(ttsConfig: Array<TTSAiConfig>, ttsProvider: TTSProvider): TTSBing | TTSAmazonPolly | TTSWatson | TTSGoogle {
		let aiConfig: TTSAiConfig;
		if (ttsConfig) {
			aiConfig = ttsConfig.find((ttsAiConfig) => ttsAiConfig['provider'] === ttsProvider);
		}
		if (aiConfig) {
			return aiConfig.config;
		}
		return;
	}

	/**
	 * @description - Method patchAIFormControlValues() - To patch ttsConfig object to form
	 * @param {Array<TTSAiConfig>} ttsConfig -  Array of tts config objects, Already configured
	 * @param {TTSProvider} provider -  tts Provider
	 */
	private patchAIFormControlValues(ttsConfig: Array<TTSAiConfig>, provider: TTSProvider): void {
		const config: any = this.ttsConfigured(ttsConfig, provider) || {};
		if (Object.keys(config).length && this.ttsAIForm.get('ttsConfig')) {
			this.ttsAIForm.get('ttsConfig').patchValue(config);
		}
	}

	/**
	 * @description - Method changeAIFormControls() - To attach controls based on the TTS provider received
	 * @param {string} provider - Name of the currently selected tts provider.
	 * @return {void}
	 */
	private changeAIFormControls(provider: string): void {
		let ttsConfigControls: FormGroup;
		switch (provider.toLowerCase()) {
			case 'watson':
				ttsConfigControls = this.initWatson();
				break;
			case 'bingspeech':
				ttsConfigControls = this.initBing();
				break;
			case 'polly':
				ttsConfigControls = this.initPolly();
				break;
			case 'google':
				ttsConfigControls = this.initGoogle();
				break;
			case 'none':
				ttsConfigControls = this.formBuilder.group({});
				break;
			default:
				break;
		}
		if (ttsConfigControls) {
			this.ttsAIForm.setControl('ttsConfig', ttsConfigControls);
		}
	}


	/**
	 * @description - Method initWatson() - To group form controls for Watson TTS Configuration.
	 * @return {FormGroup} - A FormGroup object of Watson TTS configuration controls.
	 */
	private initWatson(): FormGroup {
		return this.formBuilder.group({
			username: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			password: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			voice: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
		});
	}

	/**
	 * @description - Method initBing() - To group form controls for Bing TTS Configuration.
	 * @return {FormGroup} - A FormGroup object of Bing TTS configuration controls.
	 */
	private initBing(): FormGroup {
		return this.formBuilder.group({
			subscription_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			default_locale: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			voice: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
		});
	}

	/**
	 * @description - Method initPolly() - To group form controls for Amazone Polly TTS Configuration.
	 * @return {FormGroup} - A FormGroup object of Amazone Polly TTS configuration controls.
	 */
	private initPolly(): FormGroup {
		return this.formBuilder.group({
			aws_access_key_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			aws_secret_access_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			voice: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
		});
	}

	/**
	 * @description - Method initGoogle() - To group form controls for Google TTS Configuration.
	 * @return {FormGroup} - A FormGroup object of Google TTS configuration controls.
	 */
	private initGoogle(): FormGroup {
		return this.formBuilder.group({
			project_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			private_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			client_email: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			voice: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
			language: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
		});
	}

	/**
	 * @description - Method onSelchange() - Output event listener, invoked on tts value change event.
	 * @param {Object} item - object from ttsArray, Where key -> ttsName, value-> ttsNameKey.
	 */
	onSelchange(item) {
		if (this.ttsName === item.key) {
			return;
		}
		this.ttsName = item.key;
		this.ttsNameKey = item.value;
		if (this.ttsAIForm.controls['TTSProvider']) {
			this.ttsAIForm.controls['TTSProvider'].patchValue(this.ttsNameKey);
		}
		this.changeAIFormControls(this.ttsNameKey);
		this.patchAIFormControlValues(this.ttsConfig, TTSProvider[this.ttsNameKey]);
	}
}
