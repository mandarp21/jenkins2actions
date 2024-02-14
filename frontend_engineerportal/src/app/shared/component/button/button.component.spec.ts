import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('Component: ButtonComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [
				ButtonComponent
			],
			providers: []
		});
	});

it('ButtonComponent property should be on initiate :', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		expect(component.id).toBeUndefined();
		expect(component.val).toBeUndefined();
		expect(component.boolGreen).toBeUndefined();
		expect(component.type).toBeUndefined();
		expect(component.isDisabled).toBeUndefined();
		expect(component.activateColors).toBeUndefined();
		expect(component.buttonClass).toBeUndefined();
		expect(component.inputType).toBeUndefined();
	});

	it('Button class should be "btnGreen" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = '';
		component.activateColors = true;
		component.isDisabled = false;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnGreen');
	});

it('Button class should be "btnDisabled" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = '';
		component.activateColors = true;
		component.isDisabled = true;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnDisabled');
	});

it('Button class should be "btnGreen" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.boolGreen = true;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnGreen');
	});

it('Button class should be "btnDelete" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.boolDeleteButton = true;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnDelete');
	});

	it('Button class should be "btnWhite" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.boolWhite = true;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnWhite');
	});

	it('Button class should be "btnDelete" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.boolDeleteButton = true;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnDelete');
	});

	it('Button class should be "btnExportImport" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.iconType = "import";
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnExportImport');
	});

	it('Button class should be "btnExportImport" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.iconType = "export";
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnExportImport');
	});

	it('Button class should be "btnExportImport" : ', () => {
		const fixture = TestBed.createComponent(ButtonComponent);
		const component = fixture.componentInstance;
		component.type = 'submit';
		component.activateColors = false;
		component.iconType = "export1";
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.buttonClass).toEqual('btnGray');
	});

});
