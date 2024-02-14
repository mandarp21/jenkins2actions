// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// All the application component
import { FlowComponent } from './flow/flow.component';
import { TestChatComponent } from './components/test-chat/test-chat.component';
import { ChatQuickResBtnsComponent } from './components/ui-components/chat-quick-res-btns/chat-quick-res-btns.component';
import { ChatCarouselComponent } from './components/ui-components/chat-carousel/chat-carousel.component';
import { ChatDatePickerComponent } from './components/ui-components/chat-date-picker/chat-date-picker.component';

import { StepContentComponent } from './components/step-content/step-content.component';
import { BotBuilderComponent } from './bot-builder.component';

// Routing Module
import { BotBuilderRoutingModule } from './bot-builder.routing.module';
import { SharedModule } from '../shared';
import { ConversationService } from './services/conversation.service';
import { ChatService } from './services/chat.service';
import { SelectChannelComponent } from './select-channel/select-channel.component';
import { BotBuilderDynamicModule } from './bot-builder-dynamic.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DatePipe } from '../bot-builder/pipes/custom-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BotBuilderRoutingModule,
    SharedModule,
    BotBuilderDynamicModule,
    NgxSmartModalModule.forRoot(),
    NgxMyDatePickerModule.forRoot()
  ],
  declarations: [
    FlowComponent,
    TestChatComponent,
    ChatQuickResBtnsComponent,
    ChatCarouselComponent,
    ChatDatePickerComponent,
    BotBuilderComponent,
    StepContentComponent,
    SelectChannelComponent,
    DatePipe
  ],
  entryComponents: [],
  providers: [ConversationService, ChatService]
})
export class BotBuilderModule {
  constructor() {}
}
