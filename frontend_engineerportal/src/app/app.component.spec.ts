import { async, fakeAsync, TestBed, ComponentFixture ,inject} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { ServiceAPIs } from './core/services/service-apis.service';
import { UtilService } from './services/util.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import {Idle} from '@ng-idle/core';
import { Router, NavigationEnd } from '@angular/router';
import {Keepalive, NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {BehaviorSubject,Observable,of} from "rxjs";


 class AuthMockService{
  loggedIn$ = new BehaviorSubject<boolean>(false).asObservable();
  logoutAdmin(payload) {
    return new Observable(function (observer) {
      observer.next("dummy"),
        observer.error("error thrown");
      observer.complete();
    });

  }

  isLoggedIn() {

  }

  validateAuthentication() {
    return of({});
  }

}


class RouterMock {
  events = of(new NavigationEnd(0, "dummy", 'http://localhost:4200/login'));

  navigate = jasmine.createSpy("navigate");
}

 class UtilMockService {
  getAdminFullName(){
    return "MockName"
  }
  getAdminFirstName(){
    return "test"
  }
  getAuthToken(){
    return "mock"
  }
  deleteAuthCookies(){}
}

@Component({
	selector: 'popup-modal',
	template: '',
})
export class PopupModalMockComponent {
  @Input() operation;
  @Input() rejectBtnTxt;
  @Input() confirmBtnTxt;
  @Input() opener;
  @Input() handleConfirmClickEvent(){};
}

@Component({
	selector: 'top-menu',
	template: '',
})
export class TopMenuMockComponent {
  @Input() companylogo;
  @Input() avatarlogo;
  @Input() username;
  @Input() fixHeader;
  @Input() hideFixedHeader;
  @Input() eventClick(){};
}

class keepAliveClass{
  interval(data){

  }

  onPing=new BehaviorSubject<any>("success").asObservable();
}

class IdleMockService{
  setIdle(data){};
  setTimeout(data){};
  setInterrupts(data){};
  onTimeout=new BehaviorSubject<any>(true).asObservable();
  onTimeoutWarning=new BehaviorSubject<any>(true).asObservable();
  watch(){}
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, RouterTestingModule, ToastrModule.forRoot(), NgIdleKeepaliveModule.forRoot(),],
      declarations: [AppComponent,PopupModalMockComponent,TopMenuMockComponent],
      providers : [
        ServiceAPIs,
       {provide: UtilService,useClass:UtilMockService},
        {provide:AuthService,useClass:AuthMockService},
        { provide: Router, useClass: RouterMock },
        {provide:Idle,useClass:IdleMockService},CookieService,
       {provide:Keepalive,useClass:keepAliveClass}]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('AppComponent should be defined', () => {
    fixture.whenStable().then(()=>{
      expect(component).toBeDefined();
    })
  });

  it('AppComponent converselogo should be "converse-logo.png"', () => {
    expect(component.converselogo).toBe('assets/img/Converse_Logo_White.svg');
  });

  it('AppComponent usrName should be "Chloe"', () => {
    expect(component.usrName).toBe('Chloe');
  });

  it('should handle window scroll properly"', async () => {
    component.onWindowScroll();
  });

  it('should logout user on click of logOut', inject([UtilService], (utilService: UtilService) =>{
    spyOn(utilService, "getAuthToken");
    spyOn(utilService, "deleteAuthCookies");
    let router = new RouterMock();
    component.logout();
    //expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it("should give timeout warning",()=>{
    spyOn(component,"startWatching").and.callThrough();
    component.startWatching();
    // expect(component.confirmToExtendSession).toBeFalsy();
  })

it("should handle confirm event",()=>{
  component.handleConfirmEvent(true);
})
});