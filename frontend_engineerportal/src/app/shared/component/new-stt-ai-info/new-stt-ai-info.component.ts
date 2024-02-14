import { Component, OnInit, Input, OnChanges, DoCheck, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { STT, STTProvider } from '../../../app-constant';
import { STTAiConfig, STTBing, STTGoogle, STTWatson } from '../../../model/bot.model';

@Component({
  selector: 'converse-stt-ai-info',
  styleUrls: ['new-stt-ai-info.component.sass'],
  templateUrl: 'new-stt-ai-info.component.html'
})
/**
 * @description A STT configuration component used to create/edit STT AI Info based on the STT selected
 * @param {Array<any>} sttArray - List of STT can be configured
 * @param {string} sttName - Name of the stt currently selected
 * @param {string} sttNameKey - Key corresponding the currently selected STT
 * @param {string} dropwidth - width of the dropdowm
 * @param {string} iconcaret - type of the icon
 * @param {FormGroup} sttAIForm - referance of the FormGroup
 * @param {boolean} toggleToolTip - flag to set the tooltip on hover of dropdown control
 * @param {string} tooltipKey - key to fetch the tooltip text from config file
 */
export class NewSttAIInfoComponent implements OnInit, OnChanges, DoCheck {
  sttArray: any[];
  sttName: string;
  sttNameKey: string;
  dropwidth: string;
  iconcaret: string;
  @Input() sttProvider: STTProvider;
  @Input() sttConfig: Array<STTAiConfig>;
  @Input() sttAIForm: FormGroup;
  @Input() toggleToolTip: boolean;
  @Input() tooltipKey: string;

  constructor(private formBuilder: FormBuilder) {
    this.sttArray = STT;
    this.sttName = 'STT';
    this.dropwidth = '15em';
    this.iconcaret = 'caret';
    this.sttNameKey = '';
  }

  ngOnInit() {
    this.sttAIForm.get('STTProvider').valueChanges.subscribe((value: string) => {
      if (!value) {
        this.sttName = 'STT';
        this.sttNameKey = '';
      }
    });
  }

  /**
   * @description - Angular Lifecycle hook, invoked on input property change
   * @param {SimpleChanges} changes - Defines an object that associates properties with instances of SimpleChange.
   * @return void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sttProvider'] && changes['sttProvider'].previousValue !== changes['sttProvider'].currentValue) {
      setTimeout(() => {
        this.sttNameKey = this.sttProvider;
        this.sttName = (this.sttNameKey) ?  STT.find(obj => {
          return obj.value.toLowerCase() === this.sttNameKey.toLowerCase();
        }).key : 'STT';
        this.changeAIFormControls(this.sttNameKey);
        this.patchAIFormControlValues(this.sttConfig, this.sttProvider);
      }, 0);
    }
  }

  ngDoCheck(): void {
    if (this.sttAIForm.contains('sttConfig') && this.sttName === 'STT' && this.sttNameKey === '') {
      this.sttAIForm.removeControl('sttConfig');
    }
  }

  /**
   * @description - Method sttConfigured() - To get stt config object for provider if configured
   * @param {Array<AiConfig>} nlpConfig -  Array of stt config objects, Already configured
   * @param {STTProvider} sttProvider - Currently selected stt Provider
   * @return {STTBing | STTGoogle | STTWatson } - stt config object
   */
  sttConfigured(sttConfig: Array<STTAiConfig>, sttProvider: STTProvider): STTBing | STTGoogle | STTWatson {
    let aiConfig: STTAiConfig;
    if (sttConfig) {
      aiConfig = sttConfig.find(sttAiConfig => sttAiConfig['provider'] === sttProvider);
    }
    if (aiConfig) {
      return aiConfig.config;
    }
    return;
  }

  /**
   * @description - Method changeAIFormControls() - To attach controls based on the STT provider received
   * @param {string} provider - Name of the currently selected stt provider.
   * @return {void}
   */
  private changeAIFormControls(provider: string): void {
    let sttConfigControls: FormGroup;
    switch (provider.toLowerCase()) {
      case 'watson':
        sttConfigControls = this.initWatson();
        break;
      case 'bingspeech':
        sttConfigControls = this.initBing();
        break;
      case 'google':
        sttConfigControls = this.initGoogle();
        break;
      case 'none':
        sttConfigControls = this.formBuilder.group({});
        break;
      default:
        break;
    }
    if (sttConfigControls) {
      this.sttAIForm.setControl('sttConfig', sttConfigControls);
    }
  }

  /**
   * @description - Method patchAIFormControlValues() - To patch sttConfig object to form
   * @param {Array<STTAiConfig>} sttConfig -  Array of stt config objects, Already configured
   * @param {STTProvider} provider -  stt Provider
   */
  private patchAIFormControlValues(sttConfig: Array<STTAiConfig>, provider: STTProvider): void {
    const config: any = this.sttConfigured(sttConfig, provider) || {};
    if (Object.keys(config).length && this.sttAIForm.get('sttConfig')) {
      this.sttAIForm.get('sttConfig').patchValue(config);
    }
  }

  /**
   * @description - Method initWatson() - To group form controls for Watson STT Configuration.
   * @return {FormGroup} - A FormGroup object of Watson STT configuration controls.
   */
  private initWatson(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initBing() - To group form controls for Bing STT Configuration.
   * @return {FormGroup} - A FormGroup object of Bing STT configuration controls.
   */
  private initBing(): FormGroup {
    return this.formBuilder.group({
      subscription_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      default_locale: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initGoogle() - To group form controls for Google STT Configuration.
   * @return {FormGroup} - A FormGroup object of Google STT configuration controls.
   */
  private initGoogle(): FormGroup {
    return this.formBuilder.group({
      project_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      private_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      client_email: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      language: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method onSelchange() - Output event listener, invoked on stt value change event.
   * @param {Object} item - object from sttArray, Where key -> sttName, value-> sttNameKey.
   */
  onSelchange(item) {
    if (this.sttName === item.key) {
      return;
    }
    this.sttName = item.key;
    this.sttNameKey = item.value;

    if (this.sttAIForm.controls['STTProvider']) {
      this.sttAIForm.controls['STTProvider'].patchValue(this.sttNameKey);
    }
    this.changeAIFormControls(this.sttNameKey);
    this.patchAIFormControlValues(this.sttConfig, STTProvider[this.sttNameKey]);
  }
}
