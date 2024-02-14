import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UseCaseSectionComponent } from './use-case-section.component';
import { TestBed, inject, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkerBotService } from '../../../services/worker-bot.service';
import { Observable, BehaviorSubject, observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { UseCases } from 'src/app/model/use-cases';
import { type } from 'os';
import { UtilService } from 'src/app/services/util.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
import { compileComponentFromMetadata, componentFactoryName } from '@angular/compiler';



// let comp : CreateComponent;
// const fixture = TestBed.createComponent(CreateComponent);

@Component({
	selector: 'popup-modal',
	template: '',
})
class MockPopupModalComponent {
	@Input() opener;
	@Input() type;
}

@Component({
	selector:"converse-button",
	template:""
})

class MockButtonComponent{
@Input() type;
@Input() val;
@Input() id;
@Input() activateColors;
@Input() isDisabled;
@Input() boolGreen;
@Input() click
}
const mockResponse = {useCaseId: 'mock id'};

class UtilMockService {
  getSessionStorage(id) {
    return 'mockNameFromSession';
	}
	setSessionStorage(data,ucname){
return (null)
	}
	getAdminFullName(){
		return "mockName"
	}
}

class WorkerBotMockService {
	public updateUseCases(payload): Observable<any> {
		return Observable.of({ mockResponse });
	}

	public listConversationFlows(data):Observable<any>{
		return Observable.of([{conversationFlowId:"mockData"}])

	};
}

class ExportMockService{
	exportAndDownload(text,payload):Observable<any>{return Observable.of()};
	getFileName(data){}
}

class routerMockClass{
	navigate(data){
		return true
	}
}

describe('Usecase section Component', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, FormsModule,ToastrModule.forRoot()],
			declarations: [UseCaseSectionComponent,
				MockPopupModalComponent,MockButtonComponent
			],
			providers: [
				{ provide: WorkerBotService, useClass: WorkerBotMockService },{provide:UtilService,useClass:UtilMockService},ToastrService,{provide:ExportService,useClass:ExportMockService},{provide:Router,useClass:routerMockClass}]
		}).compileComponents()
	});

it('should initiate channels with default values', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
    const comp = fixture.componentInstance;
    let useCaseDetails = new UseCases().deserialize({
			useCaseId: "",
			useCaseName: "",
			useCaseDescription:"",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "100",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		});
		comp.useCaseDetails=useCaseDetails;
		comp.averageHumanHandlingDays="10";
		comp.averageHumanHandlingMins="10";
		comp.averageHumanHandlingHours="20";
    fixture.detectChanges();
      expect(comp.channelsString).toEqual('Web,SMS');
	});

	it('should close Add channels once received', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseEditDetails = new UseCases().deserialize({
			useCaseId: "",
			useCaseName: "",
			useCaseDescription:"",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "100",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		});
    const channels = ['Web', 'SMS'];
    comp.addChannels(channels);
    expect(comp.useCaseEditDetails.useCaseChannel).toEqual(channels);
  });
  
	it('should enable edit flow on click of edit button', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
    comp.editUseCase();
    expect(comp.isEditFlow).toBeTruthy();
    expect(comp.useCaseEditDetails.useCaseId).toEqual(comp.useCaseDetails.useCaseId);
  });
  
	it('should navigate to conversation entry flow on click of create flow', inject([Router], (router: Router) => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
    spyOn(router, 'navigate');
    comp.createFlow();
    expect(router.navigate).toHaveBeenCalledWith(['usecase',"85001456-a415-4eee-b945-991c7f4bf5c6", 'conversation', 'channel']);
  }));
  
	it('should exit edit flow on click of close button', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
    comp.closeAddChannel();
    expect(comp.isEditFlow).toBeFalsy();
  });

	it('should emit event to remove usecase from the list of usecases', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
    spyOn(comp.removeEventEmitter, 'emit').and.callThrough();
    comp.remove('mockId');
    expect(comp.removeEventEmitter.emit).toHaveBeenCalledWith('mockId');
  });

	it('should construct payload and call updateusecase Api on click of save', inject([WorkerBotService], (workerBotService: WorkerBotService) => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.averageHumanHandlingDays="10";
comp.averageHumanHandlingMins="10";
comp.averageHumanHandlingHours="20";
		comp.useCaseEditDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
			comp.saveUseCase();
	}));

	it('should editFlow', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.useCaseDetails = new UseCases().deserialize({
			useCaseId: "85001456-a415-4eee-b945-991c7f4bf5c6",
			useCaseName: "1.MyNycer Signup",
			useCaseDescription:"Signup in nycer",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		})
		comp.editFlow();
		fixture.detectChanges();
	});

	it('should  askToUser', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		let useCaseDetails = new UseCases().deserialize({
			useCaseId: "",
			useCaseName: "",
			useCaseDescription:"",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "100",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		});
		comp.useCaseDetails=useCaseDetails;
		comp.askToUser("mockId");
		fixture.detectChanges();
		expect(comp.useCaseId).toEqual("mockId");
	});

	it('should  handleConfirmEvent', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		let useCaseDetails = new UseCases().deserialize({
			useCaseId: "",
			useCaseName: "",
			useCaseDescription:"",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "100",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		});
		comp.useCaseDetails=useCaseDetails;
		comp.handleConfirmEvent(true);
		fixture.detectChanges();
		expect(comp.useCaseId).toEqual(undefined);
	});

	it('should  handleConfirmEvent', () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		let useCaseDetails = new UseCases().deserialize({
			useCaseId: "",
			useCaseName: "",
			useCaseDescription:"",
			useCaseStatus: "",
			createdBy: "",
			updatedBy: "",
			createdOn: "string;",
			updatedOn: "string;",
			averageHumanHandlingTime: "100",
			collectFeedback:true,
			useCaseChannel:["Web","SMS"],
			isEditable: true,
			conversationType: ""
		});
		comp.useCaseDetails=useCaseDetails;
		comp.handleConfirmEvent(true);
		fixture.detectChanges();
		expect(comp.useCaseId).toEqual(undefined);
	});

	it('should   exportUseCase' , () => {
		const fixture = TestBed.createComponent(UseCaseSectionComponent);
		const comp = fixture.componentInstance;
		comp.exportUseCase("mockId");
	});

})
