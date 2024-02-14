import { RegisterComponent } from "./register.component";
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrModule } from "ngx-toastr";
import { NgIdleKeepaliveModule, Keepalive } from "@ng-idle/keepalive";
import { AuthService } from "../auth/auth.service";
import { UtilService } from "../services/util.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Observable, observable, of } from "rxjs";


class UtilMockService{

}

class AuthMockService{
  getLoggedIn(){
    return true
  }
  registerAdmin(data):Observable<any>{
return Observable.of("MockValue")
  }
}

class RouterMock{
navigate(data){
  return true
}
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, RouterTestingModule, ToastrModule.forRoot(), NgIdleKeepaliveModule.forRoot(),ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers : [
       {provide: UtilService,useClass:UtilMockService},
        {provide:AuthService,useClass:AuthMockService},
        { provide: Router, useClass: RouterMock },
        CookieService,
        Keepalive,FormBuilder]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();}))


  it("should be defined",()=>{
    expect(component).toBeDefined();
  })

  it("should register the user",inject([Router],(router:Router)=>{
    spyOn(router,"navigate");
    component.onRegister();
expect(router.navigate).toHaveBeenCalledWith(["login"])
  }))

  it("should register the user",inject([Router,AuthService],(router:Router,auth:AuthService)=>{
    spyOn(router,"navigate");
    spyOn(auth,"registerAdmin").and.returnValue(of(new Error()));
    component.onRegister();
// expect(router.navigate).toHaveBeenCalledWith(["login"])
  }))

  })