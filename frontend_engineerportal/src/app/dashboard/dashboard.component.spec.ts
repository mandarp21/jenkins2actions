import { Component, Input } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { DashboardService } from './services/dashboard.service';
import { AppService } from '../services/app.service';
import { ServiceAPIs } from '../core/services/service-apis.service';
import { Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UtilService } from '../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/observable/of';
import { MasterBot } from '../model/master-bot';

@Component({
	selector: 'converse-date-picker',
	template: '',
})

export class DatePickerMockComponent {
	@Input() date;
	@Input() maxDate;
	@Input() minDate;
}

@Component({
	selector: 'converse-text-display',
	template: '',
})

export class ConverTextDisplayMockComponent {
	@Input() titletext;
	@Input() statstext;
	@Input() unittext;
}

@Component({
	selector: 'converse-data-table',
	template: '',
})

export class DataTableMockComponent {
	@Input() itemheaders;
	@Input() itemlist;
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}

const botAnalyticsResponse = {automationData:{masterBotAutomationData: [],totalAutomationData:
{totalAutomationRate: 0,totalUseCases: 0}},customerSatisfaction:{masterBotCustomerSatisfaction: [],totalCustomerSatisfaction:{
	totalFeedbackRequested: 0,
	totalNoFeedback: 0,
	totalRating: 0,
	totalSatisfied: 0,
	totalUnsatisfied: 0,
	totalVerySatisfied: 0,
	totalVeryUnsatisfied: 0}},escalationData:{masterBotEscalationData: [],totalEscalationData:{
		totalEscalationRate: 0,
		totalUseCases: 0}}};

class MockAppService {
	getUseCaseAnalytics({ }) {
		return Observable.of(botAnalyticsResponse);
	}

	getIntentMatched(from,to){
		return Observable.of({
			intentsMatchedData:{
				masterBotIntentsMatchedData:[],totalIntentsMatchedData:{totalIntents: 0,
					totalIntentsMatched: 0}
			}}
		);
	}
}

class GetServiceApi {
	public getApiUrl(path: string) {
		return 'dummyurl.com/' + path;
	}
	public getHttpParams({ }) {

	}
	public getHttpHeaders(post) {

	}
}

class MockDashboardService {
	listMasterBot() {
		return Observable.of(['bot1', 'bot2']);
	}
}

describe('Component: DashboardComponent', () => {

	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			declarations: [
				DatePickerMockComponent,
				ConverTextDisplayMockComponent,
				DataTableMockComponent,
				DashboardComponent,
				ButtonMockComponent
			],
			providers: [
				{ provide: DashboardService, useClass: MockDashboardService },
				{ provide: AppService, useClass: MockAppService },
				{ provide: ServiceAPIs, useClass: GetServiceApi },
				MockDashboardService,
				UtilService,
				CookieService
			]
		});

	});
	it('DashboardComponent should get bot analytics and bot list on initial load', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges();
		// expect(component.botData).toEqual(botAnalyticsResponse);
	});

	it('DashboardComponent should set To date or From date on change of other ', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		const today = new Date();
		const tomorrow = moment(new Date()).add(1, 'days').format('DD-MMM-YYYY');
		const yesterday = moment(new Date()).add(-1, 'days').format('DD-MMM-YYYY');
		const setToDate = {
			type: 'toDate',
			date: today
		}
		const setFromDate = {
			type: 'fromDate',
			date: today
		}
		component.onDateChanged(setToDate);
		expect(component.fromMaxDate).toEqual(yesterday);
		component.onDateChanged(setFromDate);
		expect(component.toMinDate).toEqual(tomorrow);
	});

	it('DashboardComponent should navigate to create master bot on click of add button', inject([Router], (router: Router) => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		spyOn(router, 'navigate');
		component.navigateToCreate();
		expect(router.navigate).toHaveBeenCalledWith(['masterbot/create']);

	}));

	it('DashboardComponent should navigate to configure master bot on click of each bot', inject([Router], (router: Router) => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		spyOn(router, 'navigate');
		component.redirectTo('botId');
		expect(router.navigate).toHaveBeenCalledWith(['masterbot', 'botId', 'configure']);
		component.dateFilter={fromDate:"18-10-2019",toDate:"20-10-2019"}
		component.masterBots=[new MasterBot().deserialize({masterBotId:"mockId"})];
		component.refreshData("mockEvent");
		component.showConv("mockId");
	}));

});