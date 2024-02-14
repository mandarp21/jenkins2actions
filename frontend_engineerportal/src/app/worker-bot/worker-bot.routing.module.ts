import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './components/create/create.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';

import { ConfigureWorkerBotComponent } from './components/configure-worker-bot/configure-worker-bot.component';
import { UseCaseComponent } from './components/use-case/use-case.component';
import { TrainNlpComponent } from './components/train-nlp/train-nlp.component';

import { AuthGuard } from '../auth/auth.guard';

const workerBotRoutes: Routes = [
  { path: 'workerbot/create', component: CreateComponent, canActivate: [AuthGuard] },
  {
    path: 'workerbot/:id',
    component: ConfigureWorkerBotComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { redirectTo: 'configuration', path: '', pathMatch: 'full' },
          { component: ConfigurationComponent, path: 'configuration' },
          { component: UseCaseComponent, path: 'use-cases' },
          { component: ConversationComponent, path: 'conversation-log' },
          { component: TrainNlpComponent, path: 'train-nlp' },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(workerBotRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WorkerBotRouteModule { }
