// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Application Module
import { SharedModule } from '../shared';
import { BotBuilderDynamicModule } from '../bot-builder/bot-builder-dynamic.module'

// Module components
import { CreateComponent } from './components/create/create.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { ConversationComponent } from './components/conversation/conversation.component';

// Routing Module
import { MasterBotRouteModule } from './master-bot.routing.module';

// Module providers
import { MasterBotService } from './services/master-bot.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MasterBotRouteModule,
    BotBuilderDynamicModule
  ],
  declarations: [
    CreateComponent,
    ConversationComponent,
    PerformanceComponent,
    ConfigureComponent
  ],
  providers: [
    MasterBotService
  ]
})
export class MasterBotModule { }
