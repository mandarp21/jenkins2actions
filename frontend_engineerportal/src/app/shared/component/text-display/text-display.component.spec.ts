import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { TextDisplayComponent } from './text-display.component';

@Component({
	selector: 'converse-rating',
	template: '',
})
export class RatingMockComponent {
  @Input() ratingtext;
  @Input() chartdata;
}

describe('Component: TextDisplayComponent', () => {

	let component: TextDisplayComponent;
	let fixture: ComponentFixture<TextDisplayComponent>;
	let bottomTextElem: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TextDisplayComponent,RatingMockComponent]
		});
		fixture = TestBed.createComponent(TextDisplayComponent);
		component = fixture.componentInstance;
	});
	it('TextDisplayComponent should be defined', () => {
		expect(component).toBeDefined();
	});

	it('Component @Input titletext should be undefined', () => {
		expect(component.titletext).toBeUndefined();
	});

	it('Component @Input statstext should be undefined', () => {
		expect(component.statstext).toBeUndefined();
	});

	it('Component @Input unittext should be undefined', () => {
		expect(component.unittext).toBeUndefined();
	});


	it('Component Customer Satisfaction should show Total Reviews', () => {
		component.titletext = 'Customer Satisfaction';
		component.unittext = '';
		fixture.detectChanges();
		bottomTextElem = fixture.debugElement.query(By.css('.min-title-cls'));
		expect(bottomTextElem.nativeElement.textContent.trim()).toEqual('Rating Average');
	});

	it('Component  should show Total Volume', () => {
		component.titletext = '';
		component.unittext = '';
component.onClickRefresh("event");
component.onMouseHover("event");
		fixture.detectChanges();
		bottomTextElem = fixture.debugElement.query(By.css('.min-title-cls'));

		expect(bottomTextElem.nativeElement.textContent.trim()).toEqual('Total Volume');
	});

});

