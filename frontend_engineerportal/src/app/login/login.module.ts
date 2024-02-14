// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Application Modules
import { SharedModule } from '../shared';

// All the application component
import { LoginComponent } from './login.component';

// Routing Module
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
