import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  converselogo: string;
  errorString: string;
  loginForm: FormGroup;
  loginServiceSubscription: Subscription;
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookiesService: CookieService
  ) {
    this.converselogo = 'assets/img/Converse_Logo_White.svg';
  }

  ngOnInit() {
    this.bodyTag.style.backgroundColor = '#393e41';

    if (this.authService.getLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(6)]],
      adminRole: 'Engineer'
    });
  }

  onChange($event) {
    this.errorString = '';
  }

  onLogin() {
    this.errorString = undefined;
    this.loginServiceSubscription = this.authService.authenticateAdmin(this.loginForm.value).subscribe(
      (data: any) => {
        this.authService.isLoggedIn();
        this.router.navigate(['dashboard']);
      },
      error => {
        if (error.error !== undefined) {
          if (error.error.errors !== undefined && error.error.errors[0] !== undefined) {
            //this.errorString = error.error.errors[0].messages[0];
            this.errorString = 'Both username and password are required'
          } else if (error.error.statusText !== 'Bad Request') {
            this.errorString = error.error.statusText;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.bodyTag.style.backgroundColor = '#f7f7f7';
    if (this.loginServiceSubscription) {
      this.loginServiceSubscription.unsubscribe();
    }
  }
}
