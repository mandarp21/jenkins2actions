import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewUseCaseSectionComponent } from './new-use-case-section.component';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkerBotService } from '../../services/worker-bot.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { ButtonComponent } from 'src/app/shared/component/button/button.component';
import { UtilService } from 'src/app/services/util.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';

// let comp : CreateComponent;
// const fixture = TestBed.createComponent(CreateComponent);

@Component({
	selector: 'converse-use-case-add-channel',
	template: '',
})
class MockUseCaseAddChannelComponent {
	@Input() channels
	
}
class WorkerBotMockService {
	public postUseCases(payload): Observable<any> {
		return Observable.of({
			botId: 'mock id'
		});
	}
}

class UtilMockService {
  getAdminFullName(){
    return "MockName"
  }
  getAdminFirstName(){
    return "test"
  }
  getAuthToken(){
    return true
  }
  deleteAuthCookies(){}
}


describe('NewUsecase Section Bot Component', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, FormsModule,ToastrModule.forRoot()],
			declarations: [NewUseCaseSectionComponent,ButtonComponent,
				MockUseCaseAddChannelComponent
			],
			providers: [
				{ provide: WorkerBotService, useClass: WorkerBotMockService },UtilService,{provide:UtilService,useClass:UtilMockService},ToastrService
			]
		}).compileComponents()
	});

	it('should emit click event and set addnewclass flag to true on click of Add new use case icon', () => {
		const fixture = TestBed.createComponent(NewUseCaseSectionComponent);
		const comp = fixture.componentInstance;
		spyOn(comp.clickEventEmitter, 'emit');
    comp.addNewUseCaseDialog();
    expect(comp.isAddButtonClicked).toBeTruthy();
    expect(comp.clickEventEmitter.emit).toHaveBeenCalled();
	});

	it('should close Add channel section on click of close', () => {
		const fixture = TestBed.createComponent(NewUseCaseSectionComponent);
		const comp = fixture.componentInstance;
    comp.closeAddChannel();
    expect(comp.isAddButtonClicked).toBeFalsy();
	});

	it('should addChannels to the usecase details channels list', () => {
		const fixture = TestBed.createComponent(NewUseCaseSectionComponent);
    const comp = fixture.componentInstance;
		const channels = ['web', 'email'];
		fixture.detectChanges();
		fixture.whenStable().then(() => {
    // expect(comp.useCaseDetails.channels.length).toEqual(0);
    comp.addChannels(channels);
		// expect(comp.useCaseDetails.channels.length).toEqual(channels.length);
		});
	});

	it('should construct payload and call postusecase Api on click of save', inject([WorkerBotService], (workerBotService: WorkerBotService) => {
		const fixture = TestBed.createComponent(NewUseCaseSectionComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			const date = new Date();
			const dateTime: string = date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
			comp.workerBotId = 'id';
			comp.useCaseDetails.createdOn = dateTime;
			comp.useCaseDetails.updatedBy = 'Chloe';
			comp.useCaseDetails.updatedOn = dateTime;
			comp.workerBotId = this.workerBotId;
			comp.useCaseDetails.collectFeedback = false;
			comp.useCaseDetails.averageHumanHandlingTime = '5';
			spyOn(workerBotService, 'postUseCases').and.callThrough();
			comp.saveUseCase();
			// comp.workerBotService.postUseCases(comp).subscribe((response) => {
			// 	expect(response).toEqual();
			// 	expect(comp.requestDone).toBeTruthy();
			// });

  //  expect(workerBotService.postUseCases).toHaveBeenCalledWith(comp.useCaseDetails);
		});
	}));
})
