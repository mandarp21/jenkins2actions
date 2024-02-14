import { ServiceAPIs } from '../core/services/service-apis.service';
import { UtilService } from '../services/util.service';
import {AuthService} from '../auth/auth.service';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import {User,AdminRoles} from "src/app/model/user.interface";
import { componentFactoryName } from '@angular/compiler';


let User:User;
this.User={
  adminEmail: "Mock",
  adminPassword: "Mock",
  adminRole: AdminRoles
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


class GetServiceApi {
  public getApiUrl(path: string, env: string) {
    if (env === 'dev') {
      return 'dummyurl.com/' + path;
    }
  }
}

describe("Auth Service",()=>{
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ BaseRequestOptions,
        MockBackend,
      AuthService,{ provide: ServiceAPIs, useClass: GetServiceApi }, 
      {provide:UtilService,useClass:UtilMockService},
      {
        deps: [MockBackend, BaseRequestOptions],
        provide: HttpClient,
        useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }}
      ]
    });
  })

    it("auth service works",inject([AuthService],(authservice:AuthService)=>{
      authservice.loggedIn$.subscribe(response=>{
        expect(response).toBeTruthy();
      })
    }))

    it("validateAuthentication works",inject([AuthService,MockBackend,ServiceAPIs],(authservice:AuthService,backend: MockBackend,serviceapi:ServiceAPIs)=>{
      backend.connections.subscribe(connection => {
        connection.mockRespond({cookies:"",expires:"18-11-2020"});
      });
      authservice.validateAuthentication({},false).subscribe(response=>{
        spyOn(serviceapi,"getApiUrl");
        spyOn(authservice,"setAdminCookies");
        // expect(authservice.setAdminCookies).toHaveBeenCalled();
        expect(response).toBeDefined();
      })
    }))
  
    it("authenticateAdmin works",inject([AuthService,MockBackend,ServiceAPIs],(authservice:AuthService,backend:MockBackend,serviceapi:ServiceAPIs)=>{
      backend.connections.subscribe(connection => {
        connection.mockRespond({cookies:["mockCookie"],expires:"18/11/2020"});
      });
      authservice.authenticateAdmin(User).subscribe(response=>{
        spyOn(serviceapi,"getApiUrl");
          expect(response).toBeDefined();
        })
    }))

    it("registerAdmin",inject([AuthService,MockBackend,ServiceAPIs],(authservice:AuthService,backend:MockBackend,serviceapi:ServiceAPIs)=>{
      backend.connections.subscribe(connection => {
        connection.mockRespond({cookies:"",expires:"18/11/2020"});})
        spyOn(serviceapi,"getApiUrl");
      authservice.registerAdmin(User).subscribe(response=>{
        expect(response).toBeDefined(); }) 
    }))

    it("logoutAdmin",inject([AuthService,MockBackend,ServiceAPIs],(authservice:AuthService,backend:MockBackend,serviceapi:ServiceAPIs)=>{
      backend.connections.subscribe(connection => {
        connection.mockRespond({cookies:"",expires:"18/11/2020"})})
      authservice.logoutAdmin({}).subscribe(response=>{
        spyOn(serviceapi,"getApiUrl");
        expect(response).toBeDefined();
      })
      }))
})
