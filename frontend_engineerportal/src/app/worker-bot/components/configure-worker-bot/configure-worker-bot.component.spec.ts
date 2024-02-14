/**
 * Unit tests for the Accept Econsent Modal component
 */
import { Component, Input } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, BehaviorSubject } from '../../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import { ConfigureWorkerBotComponent } from './configure-worker-bot.component';
import { WorkerBotService } from '../../services/worker-bot.service';
import { UtilService } from '../../../services/util.service';
import { WorkerBot } from 'src/app/model/worker-bot';

const masterBotresponse = {
  botImage: 'https://abc',
  botDefaultAuthentication: false,
  botDefaultLanguage: 'english',
  botDefaultBotId: 'id',
  botName: 'MockedResponseFromService'
}

const workerBotResponse = {
botName :"mockNameFromSession",
  masterBotId: 'masterIdMock',
  requireAuthentication: false,
  botLanguage: 'english',
  associatedIntents: ['intent1'],
  associatedEntities: ['entity1']
}

const store = {};
const mockSessionStorage = {
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
}
class WorkerBotMockService {
  constructor(){
    this.workerBot.next(workerBotResponse)
  }
  public workerBot=new BehaviorSubject(null);
  public workerBot$: Observable<any>= this.workerBot.asObservable();
  
  getWorkerBot(): Observable<any> {
    return Observable.of(workerBotResponse);
  }

  public getMasterBot(): Observable<any> {
    return Observable.of(masterBotresponse);
  }
  public publishWorkerBot(){}
}

class WorkerBotMockErrorService {
  getWorkerBot() {
    return new Error('error');
  }

  public getMasterBot() {
    return new Error('error');
  }
}

class UtilMockService {
  getSessionStorage(id) {
    return 'mockNameFromSession';
  }
  setSessionStorage(str,data){
    return {}
  }
}

class UtilMockSessionStorage {
  getSessionStorage(id) {
    return 'MockedResponseFromService';
  }
}

const activatedRoute = {
  params: Observable.of({
    id: 'testId'
  }),
};

@Component({
  selector: 'converse-nav-tabs',
  template: '',
})
export class NavTabsMockComponent {
  @Input() sideBarLinks;
}

@Component({
  selector: 'nav-bar',
  template: '',
})
export class NavBarMockComponent {
  @Input() title;
  @Input() prevpage;
}

describe('Configure-worker-bot Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ConfigureWorkerBotComponent,
        NavTabsMockComponent,
        NavBarMockComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: WorkerBotService, useClass: WorkerBotMockService },
        { provide: UtilService, useClass: UtilMockService }
      ]
    })
      .compileComponents();
  });

  it('should get worker bot id, worker bot info and worker bot name from session storage if it is present', inject([WorkerBotService], (workerBotService: WorkerBotService) => {
    const fixture = TestBed.createComponent(ConfigureWorkerBotComponent);
    const comp = fixture.componentInstance;
    comp.workerBotSubscription = workerBotService.getWorkerBot(this.workerBotId).subscribe();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.workerBotId).toEqual('testId');
      expect(comp.masterBotId).toEqual('masterIdMock');
      expect(comp.masterBotName).toEqual('mockNameFromSession');
    });
  }));

  it('should get worker bot name from service if it is not present in session storage', inject([UtilService],(utilservice:UtilService) => {
    const fixture = TestBed.createComponent(ConfigureWorkerBotComponent);
    const comp = fixture.componentInstance;
    comp.masterBotName = utilservice.getSessionStorage(this.workerBotId);
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(comp.masterBotName).toEqual('mockNameFromSession');
    })
  }));

  it('should navigate to masterbot dashboard', inject([Router], (router: Router) => {
    TestBed.overrideProvider(WorkerBotService, { useValue: new WorkerBotMockErrorService() });
    TestBed.compileComponents();
    const fixture = TestBed.createComponent(ConfigureWorkerBotComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(router, 'navigate');
    comp.redirectToMasterBotDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['masterbot', 'masterIdMock']);
    fixture.destroy();
  }));

  it('should navigate to dashboard', inject([Router, WorkerBotService], (router: Router, workerBotService: WorkerBotService) => {
    const fixture = TestBed.createComponent(ConfigureWorkerBotComponent);
    const comp = fixture.componentInstance;
    spyOn(router, 'navigate');
    comp.workerBotSubscription = workerBotService.getWorkerBot(this.workerBotId).subscribe();
    comp.routeParamSubscription = activatedRoute.params.subscribe();
    comp.botServiceSubscription = workerBotService.workerBot$.subscribe();
    comp.navigateToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    fixture.destroy();
  }));
});