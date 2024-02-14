import { Component, OnInit, Input, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NLP, NLPProvider, luisRegion, watsonRegion, Region } from '../../../app-constant';
import { NLPAiConfig, Watson, DialogFlow, Lex, Luis } from '../../../model/bot.model';

/**
 * @description A NLP configuration component used to create/edit NLP AI Info based on the NLP selected
 * @param {Array<any>} nlpArray - List of NLP can be configured
 * @param {string} nlpName - Name of the nlp currently selected
 * @param {string} nlpNameKey - Key corresponding the currently selected NLP
 * @param {string} dropwidth - width of the dropdowm
 * @param {string} iconcaret - type of the icon
 * @param {FormGroup} nlpAIForm - referance of the FormGroup
 * @param {NLPProvider} nlpProvider - NLP value received in case of the edit NLP AI info
 * @param {Array<NLPAiConfig>} nlpConfig - Array of the NLP config objects in case of the edit NLP AI info *
 * @param {boolean} toggleToolTip - flag to set the tooltip on hover of dropdown control
 * @param {string} tooltipKey - key to fetch the tooltip text from config file
 */
@Component({
  selector: 'converse-nlp-ai-info',
  styleUrls: ['new-nlp-ai-info.component.sass'],
  templateUrl: 'new-nlp-ai-info.component.html'
})
export class NewNlpAIInfoComponent implements OnInit, OnChanges, DoCheck {
  region: string;
  regionKey: string;
  watsonRegionArr: any[];
  nlpArray: any[];
  nlpName: string;
  nlpNameKey: string;
  luisRegionArr: any[];
  dropwidth: string;
  iconcaret: string;
  isRegionChanges: boolean;
  @Input()
  nlpAIForm: FormGroup;
  @Input()
  regionForm: FormGroup;
  @Input()
  nlpProvider: NLPProvider;
  @Input()
  regionL: watsonRegion;
  @Input()
  nlpConfig: Array<NLPAiConfig>;
  @Input()
  toggleToolTip: boolean;
  @Input()
  tooltipKey: string;

  constructor(private formBuilder: FormBuilder) {
    this.nlpArray = NLP;
    this.watsonRegionArr = Region;
    this.nlpName = 'NLP';
    this.region = 'Region';
    this.regionKey = '';
    this.nlpNameKey = '';
    this.luisRegionArr = luisRegion;
    this.regionKey = '';
    this.region = 'Select Region';
  }

  ngOnInit() {
    this.nlpAIForm.get('NLPProvider').valueChanges.subscribe((value: string) => {
      if (!value) {
        this.nlpName = 'NLP';
        this.nlpNameKey = '';
      }
    });
  }

  /**
   * @description - Angular Lifecycle hook, invoked on input property change
   * @param {SimpleChanges} changes - Defines an object that associates properties with instances of SimpleChange.
   * @return void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nlpProvider'] && changes['nlpProvider'].previousValue !== changes['nlpProvider'].currentValue) {
      setTimeout(() => {
        this.nlpNameKey = this.nlpProvider; // enum to string
        this.nlpName = this.nlpNameKey
          ? NLP.find(obj => {
              return obj.value.toLowerCase() === this.nlpNameKey.toLowerCase();
            }).key
          : 'NLP';
        this.changeAIFormControls(this.nlpNameKey);
        this.patchAIFormControlValues(this.nlpConfig, this.nlpProvider);
      }, 0);
    }
  }

  ngDoCheck(): void {
    if (this.nlpAIForm.contains('nlpConfig') && this.nlpName === 'NLP' && this.nlpNameKey === '') {
      console.log('I call the if in ngDoCheck');
      this.nlpAIForm.removeControl('nlpConfig');
    }
  }

  /**
   * @description - Method nlpConfigured() - To get nlp config object for provider if configured
   * @param {Array<AiConfig>} nlpConfig -  Array of nlp config objects, Already configured
   * @param {NLPProvider} nlpProvider - Currently selected Nlp Provider
   * @return {Watson | Lex | Luis | DialogFlow} - nlp config object
   */
  nlpConfigured(nlpConfig: Array<NLPAiConfig>, nlpProvider: NLPProvider): Watson | Lex | Luis | DialogFlow {
    let aiConfig: NLPAiConfig;
    if (nlpConfig) {
      aiConfig = nlpConfig.find(nlpAiConfig => nlpAiConfig['provider'] === nlpProvider);
    }
    if (aiConfig) {
      return aiConfig.config;
    }
    return;
  }

  /**
   * @description - Method changeAIFormControls() - To attach controls based on the nlp provider received
   * @param {string} provider - Name of the currently selected nlp provider.
   * @return {void}
   */
  private changeAIFormControls(provider: string): void {
    let nlpConfigControls: FormGroup;
    switch (provider.toLowerCase()) {
      case 'watson':
        nlpConfigControls = this.initWatson();
        break;
      case 'dialogflow_v2':
        nlpConfigControls = this.initDialogFlow();
        break;
      case 'luis':
        nlpConfigControls = this.initLuis();
        break;
      case 'lex':
        nlpConfigControls = this.initLex();
        break;
      case 'rasa':
        nlpConfigControls = this.initRasa();
        break;
      case 'rhea':
        nlpConfigControls = this.initRhea();
        break;
      case 'alexa':
        nlpConfigControls = this.initAlexa();
        break;
      default:
        break;
    }
    if (nlpConfigControls) {
      this.nlpAIForm.setControl('nlpConfig', nlpConfigControls);
    }
  }

  /**
   * @description - Method patchAIFormControlValues() - To patch nlpConfig object to form
   * @param {Array<AiConfig>} nlpConfig -  Array of nlp config objects, Already configured
   * @param {NLPProvider} provider -  nlp Provider
   */
  private patchAIFormControlValues(nlpConfig: Array<NLPAiConfig>, provider: NLPProvider): void {
    const config: any = this.nlpConfigured(nlpConfig, provider) || {};
    if (Object.keys(config).length) {
      this.region = config.region;
      this.nlpAIForm.get('nlpConfig').patchValue(config);
    }
  }
  /**
   * @description - Method initWatson() - To group form controls for Watson NLP Configuration.
   * @return {FormGroup} - A FormGroup object of Watson NLP configuration controls.
   */
  private initWatson(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      workspace_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      region: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initDialogFlow() - To group form controls for DialogFlow NLP Configuration.
   * @return {FormGroup} - A FormGroup object of DialogFlow NLP configuration controls.
   */
  private initDialogFlow(): FormGroup {
    return this.formBuilder.group({
      client_email: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      private_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      projectId: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      language: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initLuis() - To group form controls for LUIS NLP Configuration.
   * @return {FormGroup} - A FormGroup object of LUIS NLP configuration controls.
   */
  private initLuis(): FormGroup {
    return this.formBuilder.group({
      starter_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      app_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      api_subscription_key: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      version_id: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      region: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initLex() - To group form controls for LEX NLP Configuration.
   * @return {FormGroup} - A FormGroup object of LEX NLP configuration controls.
   */
  private initLex(): FormGroup {
    return this.formBuilder.group({
      bot_name: ['', Validators.required],
      alias: ['', Validators.required],
      region: ['', [Validators.required]],
      accessKeyId: ['', [Validators.required]],
      secretAccessKey: ['', [Validators.required]],
      userId: ['', [Validators.required]]
    });
  }

  /**
   * @description - Method initRasa() - To group form controls for RASA NLP Configuration.
   * @return {FormGroup} - A FormGroup object of RASA NLP configuration controls.
   */
  private initRasa(): FormGroup {
    return this.formBuilder.group({
      projectId: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initRhea() - To group form controls for Rhea NLP Configuration.
   * @return {FormGroup} - A FormGroup object of RHEA NLP configuration controls.
   */
  private initRhea(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      corpusId: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
  }

  /**
   * @description - Method initAlexa() - To group form controls for Alexa NLP Configuration.
   * @return {FormGroup} - A FormGroup object of Alexa NLP configuration controls.
   */
  private initAlexa(): FormGroup {
    return this.formBuilder.group({
      alexaJsonInput: ['', Validators.required]
    });
  }

  /**
   * @description - Method onSelchange() - Output event listener, invoked on nlp value change event.
   * @param {Object} item - object from nlpArray, Where key -> nlpName, value-> nlpNameKey.
   */
  onSelchange(item) {
    this.nlpName = item.key;
    this.nlpNameKey = item.value;
    this.nlpAIForm.controls['NLPProvider'].patchValue(this.nlpNameKey);
    this.changeAIFormControls(this.nlpNameKey);
    this.patchAIFormControlValues(this.nlpConfig, NLPProvider[this.nlpNameKey]); // string to enum
  }

  /**
   * @description - Method onRegchange() - Output event listener, invoked on region value change event.
   * @param {Object} item - value and key of the selected region
   */
  onRegchange(item) {
    this.region = item.key;
    this.regionKey = item.value;
    const regionPreVal = this.nlpAIForm.getRawValue().nlpConfig;
    regionPreVal.region = this.region;
    this.nlpAIForm.get('nlpConfig').setValue(regionPreVal);
    this.nlpAIForm.markAsDirty();
  }
}
