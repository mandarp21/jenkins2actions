import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BotAIInfoComponent } from './bot-ai-info.component';

describe('Component: BotAIInfoComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				BotAIInfoComponent
			],
			providers: []
		});
	});

	it('BotAIInfoComponent property should be on initiate :', () => {
		const fixture = TestBed.createComponent(BotAIInfoComponent);
		const component = fixture.componentInstance;
		expect(component.naturalLanguageProcessing).toBeUndefined();
		expect(component.speechToText).toBeUndefined();
		expect(component.textToSpeech).toBeUndefined();
	});
});
