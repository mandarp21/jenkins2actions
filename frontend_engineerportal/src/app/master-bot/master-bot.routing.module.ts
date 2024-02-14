import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './components/create/create.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { ConversationComponent } from './components/conversation/conversation.component';

import { AuthGuard } from '../auth/auth.guard';

const masterBotRoutes: Routes = [
  { path: 'masterbot/create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'masterbot/:id', redirectTo: 'masterbot/:id/performance', pathMatch: 'full' },
  { path: 'masterbot/:id/performance', component: PerformanceComponent, canActivate: [AuthGuard] },
  { path: 'masterbot/:id/configure', component: ConfigureComponent, canActivate: [AuthGuard] },
  { path: 'masterbot/:id/conversation', component: ConversationComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(masterBotRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class MasterBotRouteModule { }
