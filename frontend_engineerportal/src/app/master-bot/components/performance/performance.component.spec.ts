import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, BehaviorSubject } from '../../../../../node_modules/rxjs';
import { MasterBotService } from '../../services/master-bot.service';
import { PerformanceComponent } from './performance.component';
import 'rxjs/add/observable/of';
import * as moment from 'moment';
import { AppService } from '../../../services/app.service';
import { TextDisplayComponent } from '../../../shared/component/text-display/text-display.component';
import { UtilService } from '../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceAPIs } from '../../../core/services/service-apis.service';
import { Analytics } from 'src/app/model/analytics';
import{TooltipConverseDirective} from "src/app/shared/component/converse-tooltip/directive/tooltip.directive"
import { ConversationService } from 'src/app/bot-builder/services/conversation.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { ImportService } from 'src/app/services/import.service';
import { Variable } from 'src/app/bot-builder/model/variable.model';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import {WorkerBot} from "src/app/model/worker-bot"
import { CustomerSatisfaction } from 'src/app/model/customer-satisfaction';


const activatedRoute = {
	params: of(
		{	id: 'testId'})
};

const router = jasmine.createSpyObj('Router', ['navigate']);

const bot={
	botId:"mockId",
  botName: "Default Worker Bot",
  botDescription: "",
  botStatus:"",
  botAuthentication:"",
  botLanguage: "",
  NLPProvider: "",
  nlpConfig: [],
  STTProvider: "",
  sttConfig: [],
  TTSProvider:"",
  ttsConfig: [],
  createdOn: "18/10/2019",
  createdBy: "mock",
  updatedBy: "mock",
  updatedOn: "mock"
}
const response = {
	masterBotId: 'id',
	requireAuthentication: true,
	botLanguage: 'english',
	associatedIntents: ['intent1', 'intent2'],
	associatedEntities: ['entity', 'entity2']
}

const workerBots={ masterBotId: "mockId",
  associatedIntents: ["MOck1","Mock2"],
  associatedEntities: ["MOck3","MOck4"],
  customerSatisfaction: "null",
  escalation: "null",
  intentsMatched: "null",
  automation: "null",
	barChartData:"null",
	botName:"Default Worker Bot"
}
	
const analyticsData={
	 automationData:{ masterBotAutomationData: {masterBotUseCases: 0, masterBotAutomationRate: 0},workerBotAutomationData: []},
   escalationData: { 
		masterBotEscalationData: {masterBotUseCases: 0, masterBotEscalationRate: 0},workerBotEscalationData: []
		 },
CustomerSatisfaction:{masterBotCustomerSatisfaction:{
			masterBotFeedbackRequested: 0,
			masterBotNoFeedback: 0,
			masterBotRating: 0,
			masterBotSatisfied: 0,
			masterBotUnsatisfied: 0,
			masterBotVerySatisfied: 0,
			masterBotVeryUnsatisfied: 0},workerBotCustomerSatisfaction: [ {workerBotId:{botId:"mockId"}}]}
}

const intentsMatched={
	intentsMatchedDataWithMasterBotId:{masterBotIntentsMatchedData: {masterBotIntents: 0, masterBotIntentsMatched: 0},
	workerBotIntentsMatchedData: []}
	}


@Component({
	selector: 'app-variable',
	template: '',
})

export class appVariableMockComponent {
	@Input() variable;
}

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
	selector: 'card-editor',
	template: '',
})

export class cardEditorMockComponent {
	@Input() show;
	@Input() resetVariables;
}

@Component({
	selector: 'overlay-component',
	template: '',
})

export class overlayMockComponent {
	@Input() active;
	@Input() resetVariables;
}

@Component({
	selector: 'converse-text-display',
	template: '',
})

export class ConverTextDisplayMockComponent {
	@Input() showspinner;
	@Input() titletext;
	@Input() statstext;
	@Input() unittext;
	@Input() barchartdata;
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
	@Input() boolWhite;
}

@Component({
	selector: 'nav-bar',
	template: '',
})

export class NavBarMockComponent {
	@Input() title;
	@Input() prevpage;
}

class MasterBotMockService {
	
	public variables;
	public getPerformanceListBots(): Observable<any> {
			return Observable.of(response);
	}
	
	public listVariables():Observable<any>{
		let variables=new Variable().deserialize({id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"})
	return Observable.of(variables)
	}

	getMasterBot(botid){
}

	public listWorkerBots(botID):Observable<any>{
		let workerbot=new WorkerBot().deserialize(workerBots,true);
return Observable.of([workerbot]);
	}

	deleteApiVariable(apiId){
	}

	exportVariables():Observable<any>{
		let variables=new Variable().deserialize({id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"})
	return Observable.of(variables)
	}
}

const botAnalyticsResponse = 'botAnalyticsMockResponse';
const custSatResponse = [response];
const analytics = new Analytics().deserialize(analyticsData);

class MockAppService {

	getBotAnalytics({ }) {
		return Observable.of(botAnalyticsResponse);
	}

	getCustomerSatisfaction() {
		return Observable.of(custSatResponse);
	}

	getUseCaseAnalytics(data1,data2,data3) {
		return Observable.of(analytics);
	}

	getIntentMatched(data1,data2,data3) {
		return Observable.of(intentsMatched)
	}
}

class ConversationMockService {
	resetSideBar (){
	}
	setVariable(variable){

	}
	showSideBar(){

	}
	isSideBarOpen():Observable<any>{
		let data=new BehaviorSubject<any>(true);
return data;
	}

	closeSideBar(){
		
	}
	showCreateUseCaseModal=new BehaviorSubject<any>(null).asObservable();
}

class utilMockservice{
	setSessionStorage(){

	}
	getSessionStorage(data){
  return JSON.stringify({id:"MOCKID"})
	}
  }

export class ConfigureMockComponent {
}

const mockSessionStorage1 = {
	getItem(){
		return "Nycers"
	}
	}
	const mockSessionStorage2 = {
		getItem(){
			return false
		}
		}

class importMockService{
	importAndSave(data1,data2):Observable<any>{
		return Observable.of([{status:"success"},{status:"success"}])
	}
}
describe('Component: PerformanceComponent', () => {
	let component: PerformanceComponent;
	let fixture: ComponentFixture<PerformanceComponent>;
	// let bottomTextElem: DebugElement;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientModule,ToastrModule.forRoot()],
			declarations: [
				PerformanceComponent,
				DatePickerMockComponent,
				ButtonMockComponent,
				DataTableMockComponent,
				ConverTextDisplayMockComponent,
				NavBarMockComponent,cardEditorMockComponent,appVariableMockComponent,overlayMockComponent,TooltipConverseDirective
				//TextDisplayComponent
			],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				{provide:ConversationService,useClass:ConversationMockService},
				{ provide: Router, useValue: router },
				{ provide: MasterBotService, useClass: MasterBotMockService },
				{ provide: AppService, useClass: MockAppService },
				{provide:UtilService,useClass:utilMockservice},
				CookieService,
				MasterBotService,
				ServiceAPIs,ToastrService,{provide:ImportService,useClass:importMockService}

			]
		})
	});

	it('expect component to be defined',inject([MasterBotService],(master:MasterBotService) => {
		fixture = TestBed.createComponent(PerformanceComponent);
		component = fixture.componentInstance;
		component.dateFilter={ fromDate:"20/10/219",toDate:"21/10/2019"};
		let workerbot=new WorkerBot().deserialize(workerBots,true);
		component.workerBots=[workerbot];
		let analyticsMock=new Analytics().deserialize(analyticsData);
		component.analytics=analyticsMock;
		spyOn(master,"listVariables").and.returnValue(of([{id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"}]));
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage1});
		fixture.detectChanges();
		expect(component).toBeDefined();
	}));

	it('expect component to be defined if session storage is not present',inject([MasterBotService],(master:MasterBotService) => {
		fixture = TestBed.createComponent(PerformanceComponent);
		component = fixture.componentInstance;
		component.dateFilter={ fromDate:"20/10/219",toDate:"21/10/2019"};
		let workerbot=new WorkerBot().deserialize(workerBots,true);
		component.workerBots=[workerbot];
		let analyticsMock=new Analytics().deserialize(analyticsData);
		component.analytics=analyticsMock;
		spyOn(master,"listVariables").and.returnValue(of([{id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"}]));
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage2 });
		fixture.detectChanges();
		expect(component).toBeDefined();
	}));

	it('expect component to be defined if masterbot is not present',inject([MasterBotService],(master:MasterBotService) => {
		fixture = TestBed.createComponent(PerformanceComponent);
		component = fixture.componentInstance;
		component.dateFilter={ fromDate:"20/10/219",toDate:"21/10/2019"};
		component.workerBots=null;
		let analyticsMock=new Analytics().deserialize(analyticsData);
		component.analytics=analyticsMock;
		spyOn(master,"listVariables").and.returnValue(of([{id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"}]));
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage2 });
		fixture.detectChanges();
		expect(component).toBeDefined();
	}));

	it("onclick should clear data",()=>{
		component.fromDate="20/10/2019";
		component.dateFilter={ fromDate:"20/10/219",toDate:"21/10/2019"};
		component.masterBotId="mockId";
		spyOn(component,"refreshData").and.callThrough();
		component.handleClick("mock");
		expect(component.refreshData).toHaveBeenCalledWith("20/10/2019");
	})
	it("router should navigate",()=>{
		component.masterBotId="MockId";
		component.redirectToConfig();
		expect(router.navigate).toHaveBeenCalledWith(['masterbot',"MockId", 'configure']);
		component.navigateToCreate();
		component.redirectTo("mockId");
		component.showConv("mockId");
	})
	it("should filter onDate changes",()=>{
		component.onDateChanged({ type:"toDate",date:new Date("2019-10-20")});
		expect(component.dateFilter).toEqual({ toDate: '20102019', fromDate: '20/10/219' })
	})
	it("should filter onDate changes",()=>{
		component.onDateChanged({ type:"fromDate",date:new Date("2019-10-19")});
		expect(component.dateFilter).toEqual({ fromDate: '19102019', toDate: '20102019' })
	})
	it("should delete variable bar on click",inject([MasterBotService],(master:MasterBotService)=>{
		spyOn(component,"deleteApiVariable").and.callThrough();
		component.handleEventClicked({action: "deleteVariable", variableId: "f6e76e49-d2b6-4813-aadf-1b9a8dfd855f"});
		// spyOn(master,"deleteApiVariable").and.returnValue(of("success"))
		// component.deleteApiVariable("MockAPI");
    // expect(component.deleteApiVariable).toHaveBeenCalledWith("mockAPI");
	}))

	it("should open variable side bar on click",()=>{
		spyOn(component,"openVariablesSideBar").and.callThrough();
		component.handleEventClicked({action:"editVariable",variable:{config:{"apiUri":"http://localhost:13005/getGoogleText","method":"POST","success":{"Unit testing the async await function":"c:/users/"}},description: "",id: "f6e76e49-d2b6-4813-aadf-1b9a8dfd855f",
masterBotId: "c094f4c9-b232-44bf-97fa-9a5bda54673c",
name: "something",
type: "API"}});
// component.openVariablesSideBar(new Variable());
})

	it("should list variable side bar on click",inject([MasterBotService,ConversationService],(master:MasterBotService,convo:ConversationService)=>{
		spyOn(component,"listVariables").and.callThrough();
		component.handleEventClicked({action:"closeSideBar",variableId:"mockId",actionDone:"Done"});
		spyOn(master,"listVariables").and.returnValue(of([{id:"mockid",
		masterBotId:"mockmasterbotid",
		name:"mockname",
		type:"mocktype",
		description: "mockdes",
		config:"mockcon"}]))
		// component.listVariables();
		spyOn(convo,"isSideBarOpen").and.callFake(function getValue(){
			return true
		})
		component.closeOverlay();
	}))

it('should update variables on search button click',()=>{
	let variables=new Variable().deserialize({id:"mockid",
	masterBotId:"mockmasterbotid",
	name:"mockname",
	type:"mocktype",
	description: "mockdes",
	config:"mockcon"});
	component.filterTxt="";
	component.forFiltedList=[variables];
	component.filterItems("mock");
})

it('should exportApiVariables on click',inject([MasterBotService],(master:MasterBotMockService)=>{
spyOn(master,"exportVariables").and.returnValue(of(new Variable()))
component.exportApiVariables();
}))

it('should open variable file',()=>{
component.openFileBrowser({preventDefault(){},click(){}})
})

it("should prompt on file change",()=>{
	component.onFileChange({target:{files:[{name:"mock",type:"application/json"}]}});
	component.onFileChange({target:{files:[{name:"mock",type:""}]}});
	})

it("should download url",()=>{
	component.downloadUrl("mockUrl");
})

	})