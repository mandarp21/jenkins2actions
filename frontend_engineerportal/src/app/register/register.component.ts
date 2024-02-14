import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {
  errorString: string;
  registerForm: FormGroup;
  registerServiceSubscription: Subscription;
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookiesService: CookieService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.bodyTag.style.backgroundColor = '#393e41';

    if (this.authService.getLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    this.initRegisterForm();
  }

  /**
   * @description Registration form group initalization
   */
  private initRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      adminFirstName: ['', [Validators.required]],
      adminLastName: ['', [Validators.required]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * @description Resets error message
   * @param event
   */
  onChange($event) {
    this.errorString = '';
  }

  /**
   * @description To create new admin
   */
  onRegister() {
    this.errorString = undefined;
    this.registerServiceSubscription = this.authService.registerAdmin(this.registerForm.value).subscribe(
      (data: any) => {
        this.toastrService.success('Account successfully created');
        this.router.navigate(['login']);
      },
      error => {
        if (error.error !== undefined) {
          if (error.error.errors !== undefined && error.error.errors[0] !== undefined) {
            this.errorString = 'All fields are required'
          } else if (error.error.statusText !== 'Bad Request') {
            this.errorString = error.error.statusText;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.bodyTag.style.backgroundColor = '#f7f7f7';
    if (this.registerServiceSubscription) {
      this.registerServiceSubscription.unsubscribe();
    }
  }
}
