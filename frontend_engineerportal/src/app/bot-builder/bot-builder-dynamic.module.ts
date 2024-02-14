// All core module will be here
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FileDropModule } from 'ngx-file-drop';

// All the dependency module
import { EvalConditionComponent } from './components/eval-condition/eval-condition.component';
import { DivergingAddCardComponent } from './components/diverging-add-card/diverging-add-card.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { ReferenceCardComponent } from './components/reference-card/reference-card.component';
import { FlowCardComponent } from './components/flow-card/flow-card.component';
import { NodeComponent } from './components/node/node.component';
import { CardEditorComponent } from './components/card-editor/card-editor.component';
import { ZoomComponent } from './components/zoom/zoom.component';
import { SharedModule } from '../shared';
import { CENormalFormComponent } from './components/card-editor/forms/normal/ce-form-normal.component';
import { CEConditionFormComponent } from './components/card-editor/forms/condition/ce-form-condition.component';
import { CEVariableFormComponent } from './components/card-editor/forms/variable/ce-form-variable.component';
import { CEReferenceFormComponent } from './components/card-editor/forms/reference/ce-form-reference.component';
import { CECarouselSectionComponent } from './components/card-editor/sections/carousel/ce-section-carousel.component';
import { CEFeedbackTilesSectionComponent } from './components/card-editor/sections/feedbackTiles/ce-section-feedback-tiles.component';
import { CEFeedbackReqMsgSectionComponent } from './components/card-editor/sections/feedbackReqMsg/ce-section-feedback-req-msg.component';
import { CEMessagesSectionComponent } from './components/card-editor/sections/messages/ce-section-messages.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelsEditorComponent } from './components/channels/editor/channels-editor.component';
import { ChannelsFormAddComponent } from './components/channels/editor/forms/add/channels-form-add.component';
import { ChannelsFormCopyComponent } from './components/channels/editor/forms/copy/channels-form-copy.component';
import { InputAutocompleteComponent } from './components/input-autocomplete/input-autocomplete.component';
import { ExternalRefInfoComponent } from './components/external-reference-info/external-reference-info.component';
import { CustomValuesListComponent } from './components/custom-values-list/custom-values-list.component';
import { Ng2PanZoomModule } from 'ng2-panzoom';

// Will be imported by the module created at run time for the bot builder
// Should have components that are shared between this module and the general bot builder module

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FileDropModule, SharedModule, Ng2PanZoomModule],
  declarations: [
    EvalConditionComponent,
    DivergingAddCardComponent,
    AddCardComponent,
    ReferenceCardComponent,
    FlowCardComponent,
    NodeComponent,
    CardEditorComponent,
    ZoomComponent,
    CENormalFormComponent,
    CEConditionFormComponent,
    CEVariableFormComponent,
    CECarouselSectionComponent,
    CEFeedbackTilesSectionComponent,
    CEFeedbackReqMsgSectionComponent,
    CEMessagesSectionComponent,
    ChannelsComponent,
    ChannelsEditorComponent,
    ChannelsFormAddComponent,
    ChannelsFormCopyComponent,
    InputAutocompleteComponent,
    CEReferenceFormComponent,
    ExternalRefInfoComponent,
    CustomValuesListComponent
  ],
  exports: [
    EvalConditionComponent,
    DivergingAddCardComponent,
    AddCardComponent,
    ReferenceCardComponent,
    FlowCardComponent,
    NodeComponent,
    CardEditorComponent,
    ZoomComponent,
    CENormalFormComponent,
    CEConditionFormComponent,
    CEVariableFormComponent,
    CECarouselSectionComponent,
    CEFeedbackTilesSectionComponent,
    CEFeedbackReqMsgSectionComponent,
    CEMessagesSectionComponent,
    ChannelsComponent,
    ChannelsEditorComponent,
    ChannelsFormAddComponent,
    ChannelsFormCopyComponent,
    SharedModule,
    InputAutocompleteComponent,
    CEReferenceFormComponent,
    ExternalRefInfoComponent,
    CustomValuesListComponent,
    Ng2PanZoomModule
  ],
  entryComponents: [AddCardComponent, FlowCardComponent, NodeComponent],
  providers: []
})
export class BotBuilderDynamicModule {}
