/**
 * Unit tests for the Accept Econsent Modal component
 */
import { Component, Input } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from '../../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import { ConversationComponent } from './conversation.component';
import { WorkerBotService } from '../../services/worker-bot.service';

const workerBotResponse = {
	masterBotId: 'masterIdMock',
	requireAuthentication: false,
	botLanguage: 'english',
	associatedIntents: ['intent1'],
	associatedEntities: ['entity1']
}

class WorkerBotMockService {
	getWorkerBot(): Observable<any> {
		return Observable.of(workerBotResponse);
	}
}

const activatedRoute = {
  parent: {
    snapshot: {
      paramMap: {
        get() {
          return 'testId';
        }
      }
    }
  }
};

@Component({
	selector: 'converse-conversation-log',
	template: '',
})
export class ConvLogMockComponent {
	@Input() botid;
	@Input() botname;
}

describe('Conversation component', () => {

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
			],
			declarations: [
				ConversationComponent,
				ConvLogMockComponent
			],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				{ provide: WorkerBotService, useClass: WorkerBotMockService },
			]
		})
			.compileComponents();
	});

	it('should get worker bot id, worker bot info and worker bot name from session storage if it is present', () => {
		const fixture = TestBed.createComponent(ConversationComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			expect(comp.masterBotId).toEqual('masterIdMock');
			// expect(comp.masterBotName).toEqual('mockNameFromSession');
		});
	});

	it('should navigate to masterbot dashboard', inject([Router], (router: Router) => {
		const fixture = TestBed.createComponent(ConversationComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		spyOn(router, 'navigate');
		comp.redirectToWorkerBotDashboard();
		expect(router.navigate).toHaveBeenCalledWith(['masterbot', 'masterIdMock']);
		fixture.destroy();
	}));
});