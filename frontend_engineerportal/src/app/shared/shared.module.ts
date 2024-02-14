// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// All the dependency module
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';

// All the application modules
import { UtilService } from '../services/util.service';

// All the application component
import { NewBotInfoComponent } from './component/new-bot-info/new-bot-info.component';
import { BotAIInfoComponent } from './component/bot-ai-info/bot-ai-info.component';
import { NewNlpAIInfoComponent } from './component/new-nlp-ai-info/new-nlp-ai-info.component';
import { NewSttAIInfoComponent } from './component/new-stt-ai-info/new-stt-ai-info.component';
import { NewTtsAIInfoComponent } from './component/new-tts-ai-info/new-tts-ai-info.component';
import { DatePickerComponent } from './component/date-picker/date-picker.component';
import { DataTableComponent } from './component/data-table/data-table.component';
import { DataTableNewComponent } from './component/data-table-new/data-table-new.component';
import { DropDownComponent } from './component/drop-down/drop-down.component';
import { DropDownComponentMultiple } from './component/drop-down-multiple/drop-down-multiple.component';
import { NavTabComponent } from './component/nav-tabs/nav-tabs.component';
import { RatingCardComponent } from './component/rating-card/rating-card.component';
import { TextDisplayComponent } from './component/text-display/text-display.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { ConversationLogComponent } from './component/conversation-log/conversation-log.component';
import { ConversationLogDialogComponent } from './component/conversation-log/conversation-log-dialog/conversation-log-dialog.component';
import { ConversationFilterComponent } from './component/conversation-log/conversation-filter/conversation-filter.component';
import { BarChartComponent } from './component/bar-chart/bar-chart.component';
import { ButtonComponent } from './component/button/button.component';
import { TextBoxComponent } from './component/text-input/textbox.component';
import { ErrorPanelComponent } from './component/error-panel/error-panel.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { PopupModalComponent } from './component/popup-modal/popup-modal.component';
import { SwitchButtonComponent } from './component/switch-button/switch-button.component';
import { OverlayComponent } from './component/overlay/overlay.component';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { VariableComponent } from './component/variable/variable.component';
import { EmptySpaceTrimDirective } from './directive/emptySpaceTrimDirective';
import { TooltipConverseDirective } from './component/converse-tooltip/directive/tooltip.directive';
import {
  TooltipContainerComponent
} from './component/converse-tooltip/tooltip-container.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    RouterModule,
    ClickOutsideModule
  ],
  declarations: [
    BarChartComponent,
    DatePickerComponent,
    DataTableComponent,
    DropDownComponent,
    DropDownComponentMultiple,
    NewBotInfoComponent,
    BotAIInfoComponent,
    NavTabComponent,
    TextDisplayComponent,
    RatingCardComponent,
    NewNlpAIInfoComponent,
    NewSttAIInfoComponent,
    NewTtsAIInfoComponent,
    NavBarComponent,
    ConversationLogComponent,
    ConversationLogDialogComponent,
    ConversationFilterComponent,
    ButtonComponent,
    TextBoxComponent,
    ErrorPanelComponent,
    SwitchButtonComponent,
    PopupModalComponent,
    OverlayComponent,
    TruncatePipe,
    DataTableNewComponent,
    VariableComponent,
    EmptySpaceTrimDirective,
    TooltipConverseDirective,
    TooltipContainerComponent
  ],
  exports: [
    BarChartComponent,
    DatePickerComponent,
    DataTableComponent,
    DropDownComponent,
    DropDownComponentMultiple,
    NewBotInfoComponent,
    BotAIInfoComponent,
    NavTabComponent,
    TextDisplayComponent,
    RatingCardComponent,
    NewNlpAIInfoComponent,
    NewSttAIInfoComponent,
    NewTtsAIInfoComponent,
    NavBarComponent,
    ConversationLogComponent,
    ConversationLogDialogComponent,
    ConversationFilterComponent,
    ButtonComponent,
    TextBoxComponent,
    ErrorPanelComponent,
    SwitchButtonComponent,
    PopupModalComponent,
    OverlayComponent,
    ClickOutsideModule,
    TruncatePipe,
    DataTableNewComponent,
    VariableComponent,
    EmptySpaceTrimDirective,
    TooltipConverseDirective,
    TooltipContainerComponent
  ],
  entryComponents: [ TooltipContainerComponent],
  providers: [UtilService, NgxSmartModalService]
})
export class SharedModule {}
