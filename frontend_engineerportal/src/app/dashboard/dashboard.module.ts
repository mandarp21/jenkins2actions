// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Application Modules
import { SharedModule } from '../shared';

// All the application component
import { DashboardComponent } from './dashboard.component';


// Routing Module
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
