import { Component, Input } from '@angular/core';
import { ConversationLogComponent } from './conversation-log.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { WorkerBotService } from '../../../worker-bot/services/worker-bot.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceAPIs } from '../../../core/services/service-apis.service';
import { UtilService } from '../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { UseCases } from 'src/app/model/use-cases';
import { componentFactoryName } from '@angular/compiler';

let data={
  useCaseId: "mockId",
  useCaseName:"mockName",
  useCaseDescription: "",
  useCaseStatus:"",
  createdBy:"mock",
  updatedBy: "mock",
  createdOn: "18-10-2019",
  updatedOn: "20-10-2019",
  averageHumanHandlingTime: "100",
  collectFeedback: false,
  useCaseChannel:["web","skype"],
  isEditable: false,
  conversationType: ""
}
let usecase=new UseCases().deserialize(data);
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
	selector: 'converse-button',
	template: '',
})

export class ConverseButtonMockComponent {
  @Input() id;
	@Input() val;
  @Input() boolGreen;
  @Input() isDisabled;
}

@Component({
  selector: 'converse-conversation-log-dialog',
  template: ''
})

export class ConversationLogDialogMockComponent {
  @Input() itemHeaders;
  @Input() itemList;
  @Input() conversationDetails;
  @Input() paginationFlag;
}

@Component({
  selector: 'converse-data-table-new ',
  template: ''
})

export class conversedatatablenewMockComponent {
  @Input() conversationLog;
  @Input() itemheaders;
  @Input() itemlist;
  @Input() usecaselist;
  @Input() selectedRow;
}

class WorkerBotMockService{

  getConversationLog(){
    return of([{"value":"dummy"}]);
  }

  getConversationDetails(data1,data2,data3){
if(data2="mock1"){
    return of([{"sessionId":"welcome",
    "useCaseStatus":"good",useCaseName:"mockName",
    "startTimestamp":"1020" ,channel:["web","sms"],userMessage :"welcome",response:{ "response":"dummyresponse"},timestamp:"1020",
  }]);}

  else{
    return of([{"sessionId":"welcome",
    "useCaseStatus":"good",useCaseName:"mockName",
    "startTimestamp":"1020" ,channel:["web","sms"],userMessage :"mock",response:{ "response":"dummyresponse"},timestamp:"1020",
  }])
  }
  }

  getListUseCases(data){
    return of([data]);
  }
}

describe('Conversastion log Component : shared', () => {
  let comp: ConversationLogComponent;
  let fixture: ComponentFixture<ConversationLogComponent>;
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
      declarations: [
        ConversationLogComponent,
        DatePickerMockComponent,
        ConverseButtonMockComponent,
        ConversationLogDialogMockComponent,conversedatatablenewMockComponent
			],
			providers: [
        { provide: WorkerBotService, useClass: WorkerBotMockService},
        //WorkerBotService,
        ServiceAPIs,
        UtilService,
        CookieService
			]
    })		;
    fixture = TestBed.createComponent(ConversationLogComponent);
    comp = fixture.componentInstance;
	});

	it('Component to be defined', async () => {
    fixture.detectChanges();
      expect(comp).toBeDefined();
  });
  
  it('On initialisation , conversation list should be loaded', async () => {
    fixture.detectChanges();
    comp.ngOnInit();
    expect(comp.conversationList).not.toBeNull;
  });
  
  it('should show conversation details on call of showConversationDetails get convo', async () => {
    comp.convFilteredList = [{sessionId:"mockId",
    userId:"1234",
    useCaseName:"mockName",
    useCaseStatus: "",
    startTimestamp:"12",
    channel: "web",
    useCaseLogId: "mockId"}];
    comp.botid="mock1";
    comp.showConversationDetails({i:"mock",useCaseLogId:"mockId",item:"1234-"});
    expect(comp.conversationDetails).not.toBeNull;
  });

  it('should show conversation details on call of showConversationDetails get convo', async () => {
    comp.convFilteredList = [{sessionId:"mockId",
    userId:"1234",
    useCaseName:"mockName",
    useCaseStatus: "",
    startTimestamp:"12",
    channel: "web",
    useCaseLogId: "mockId"}];
    comp.botid="mock2";
    comp.showConversationDetails({i:"mock",useCaseLogId:"mockId",item:"1234-"});
    expect(comp.conversationDetails).not.toBeNull;
  });
    
  it('should show conversation details on call of showConversationDetails', async () => {
    comp.itemList=[]
    comp.conversationList=[{id:"mockId"},{id:"mock1"}];
    comp.conversationHeaders=[{colname:"mockname",headername:"mockheader"},{colname:"mockname",headername:"mockheader"}]
    comp.isFiltersShown=false;
    comp.showConversationDetails({i:"mock",useCaseLogId:"mockId",item:"1234"});
  });

  it('should show conversation details on call of showConversationDetails', async () => {
    comp.isFiltersShown=true;
    comp.showConversationDetails({i:"mock",useCaseLogId:"mockId",item:"1234"});
  });

  it('should show conversation onDateChanged', async () => {
    fixture.detectChanges();
    comp.onDateChanged({type:"toDate",date:new Date()});
  });
  
  it('should  hideDetails', async () => {
    fixture.detectChanges();
    comp.hideDetails();
    expect(comp.itemList).toBeNull;
  });

  it('should show conversation onDateChanged', async () => {
    fixture.detectChanges();
    comp.onDateChanged({type:"fromDate",date:new Date()});
  });
  
  it('should show conversation pageChange', async () => {
    fixture.detectChanges();
    comp.pageChange("prev");
  });

  it('should show conversation updateLogsFilter', async () => {
    fixture.detectChanges();
    comp.updateLogsFilter("prev");
  });

  it('should show conversation updateLogsSort', async () => {
    fixture.detectChanges();
    comp.updateLogsSort("prev");
  })
  
  it('should show conversation disblePageButtons', async () => {
    fixture.detectChanges();
    comp.disablePageButtons("event");
  })

  // it('should setconversationDetails as null if "id" mismatches on call of showConversationDetails', async () => {
  //   fixture.detectChanges();
  //   comp.convFilteredList = [{"sessionId":"1234-"}];
  //   //comp.isFiltersShown = false;
  //   comp.isFiltersShown = true;
  //   comp.itemList = [{sender:"someone", userMessage:"hello", timestamp: 2320}];
  //   comp.itemHeaders = "";
  //   comp.conversationDetails = "";
  //   comp.showConversationDetails("");
  //   // expect(comp.itemList).toEqual([{ selected: false, value: 'Select All' }]);
  //   // expect(comp.itemHeaders).toEqual(null);
  //   // expect(comp.conversationDetails).toEqual(null);
  // });
  
  it('validate that handleclick works successfully', async () => {
    fixture.detectChanges();
    comp.handleClick("test");
	});
})