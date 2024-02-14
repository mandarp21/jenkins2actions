import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'bot-ai-info',
	styleUrls: ['bot-ai-info.component.sass'],
	templateUrl: 'bot-ai-info.component.html'
})
export class BotAIInfoComponent {

	@Input() naturalLanguageProcessing: string;
	@Input() speechToText: string;
	@Input() textToSpeech: string;

	constructor() { }
}
