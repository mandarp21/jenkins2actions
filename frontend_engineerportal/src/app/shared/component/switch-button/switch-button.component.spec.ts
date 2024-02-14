import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwitchButtonComponent } from './switch-button.component';

describe('Component: SwitchButtonComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				SwitchButtonComponent
			],
			providers: []
		});
	});

	it("should be defined",()=>{
		let comp = new SwitchButtonComponent();
		expect(comp).toBeDefined();
		comp.emitStatus(true);
	})
});
