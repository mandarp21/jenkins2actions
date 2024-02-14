import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import * as moment from 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

describe('DatePickerComponent', () => {
	let component: DatePickerComponent;
	let fixture: ComponentFixture<DatePickerComponent>;

	beforeEach((() => {
		TestBed.configureTestingModule({imports: [BsDatepickerModule.forRoot()],
						declarations: [DatePickerComponent]			
		})

		fixture = TestBed.createComponent(DatePickerComponent);
		component = fixture.componentInstance;
	}));

	// it('DatePickerComponent should be defined', () => {
	// 	expect(component).toBeDefined();
	// });

	it('DatePickerComponent property should be', () => {
		component.type = 'fromDate';
		component.date = moment().format('DD-MMM-YYYY');
		component.minDate = moment(moment().subtract(1,'months').format('YYYY-MM-DD')).add(1,'days').format('DD-MMM-YYYY');
		component.maxDate = moment().format('DD-MMM-YYYY');
		fixture.detectChanges();
		expect(component.type).toBeDefined();
		expect(component.minDate).toBeDefined();
		expect(component.maxDate).toBeDefined();
		expect(component.date).toBeDefined();
		expect(component.dateObj).toBeDefined();
		expect(component.maxDateObj).toBeDefined();
		expect(component.minDateObj).toBeDefined();
		expect(typeof (component.type)).toEqual('string');
		expect(typeof (component.minDate)).toEqual('object');
		expect(typeof (component.maxDate)).toEqual('object');
		expect(typeof (component.date)).toEqual('object');
		expect(typeof (component.dateObj)).toEqual('object');
		expect(typeof (component.maxDateObj)).toEqual('object');
		expect(typeof (component.minDateObj)).toEqual('object');
	});

});
