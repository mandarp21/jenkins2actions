import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BotBuilderComponent } from './bot-builder.component';

import { FlowComponent } from './flow/flow.component';
import { SelectChannelComponent } from './select-channel/select-channel.component';

import { AuthGuard } from '../auth/auth.guard';

const botBuilderRoutes: Routes = [
  { path: 'usecase/:useCaseId/conversation/channel', component: SelectChannelComponent, canActivate: [AuthGuard] },
  { path: 'conversation', component: BotBuilderComponent, pathMatch: 'full' },
  { path: 'conversation/view/:conversationId', component: FlowComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(botBuilderRoutes)],
  exports: [RouterModule]
})
export class BotBuilderRoutingModule {}
