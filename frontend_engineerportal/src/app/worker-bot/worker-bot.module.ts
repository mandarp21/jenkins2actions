// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../shared';
import { UtilService } from '../services/util.service';

// Application Module
import { WorkerBotRouteModule } from './worker-bot.routing.module';
import { CreateComponent } from './components/create/create.component';
import { ConfigureWorkerBotComponent } from './components/configure-worker-bot/configure-worker-bot.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { UseCaseComponent } from './components/use-case/use-case.component';

import { TrainNlpComponent } from './components/train-nlp/train-nlp.component';
import { UseCaseSectionComponent } from './components/use-case/use-case-section/use-case-section.component';
import { UseCaseChannelComponent } from './components/use-case-add-channel/use-case-add-channel.component';
import { NewUseCaseSectionComponent } from './components/new-use-case-section/new-use-case-section.component';

import { ConfigureAssociatedIntentsComponent } from './components/configure-associated-intents/configure-associated-intents.component';
import { DashboardModule } from '../dashboard';
import { WorkerBotService } from './services/worker-bot.service';
import { ConversationComponent } from 'src/app/worker-bot/components/conversation/conversation.component';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, WorkerBotRouteModule, DashboardModule, BrowserAnimationsModule, ReactiveFormsModule],
  declarations: [
    CreateComponent,
    ConversationComponent,
    ConfigureWorkerBotComponent,
    ConfigurationComponent,
    UseCaseComponent,
    TrainNlpComponent,
    UseCaseSectionComponent,
    UseCaseChannelComponent,
    NewUseCaseSectionComponent,
    ConfigureAssociatedIntentsComponent
  ],
  providers: [WorkerBotService, UtilService]
})
export class WorkerBotModule {
  constructor() {}
}
