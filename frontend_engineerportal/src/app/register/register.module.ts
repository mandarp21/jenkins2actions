// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Application Modules
import { SharedModule } from '../shared';

// All the application component
import { RegisterComponent } from './register.component';

// Routing Module
import { RegisterRoutingModule } from './register-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    RegisterComponent
  ]
})
export class RegisterModule { }
