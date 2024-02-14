import { Component } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { ConversationService } from '../../services/conversation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'external-reference-info',
  styleUrls: ['external-reference-info.component.sass'],
  templateUrl: 'external-reference-info.component.html'
})
export class ExternalRefInfoComponent {
  refComponent: NodeComponent;
  confirmationVisible: boolean;

  constructor(private conversationService: ConversationService, private router: Router, private toastr: ToastrService) {
    this.conversationService.activeExternalRefObs.subscribe(item => {
      this.refComponent = item;
      if (!this.refComponent) this.confirmationVisible = false;
    });
  }

  /**
   * @description handles navigating to the referenced use case
   */
  async navigateToUseCase() {
    const activeChannel = this.conversationService.getConversationData().getValue()['channel'];
    const convFlows = await this.conversationService.listConversationFlows(this.refComponent.useCaseId, false).toPromise();
    const targetConversation = convFlows.find(item => item.channel === activeChannel);
    if (targetConversation) {
      this.router.navigate(['conversation/view', targetConversation.conversationFlowId]);
    } else {
      this.toastr.error('Referenced use case does not have a ' + activeChannel + ' channel', 'Failed to navigate');
    }
  }

  /**
   * @description closes the window and overlay
   */
  closeWindow() {
    this.conversationService.hideOverlay(true);
  }

  /**
   * @description handles clicking of the 'go to use case' button
   * @param needsValidation boolean value - decide if validation is required for unsaved changes
   */
  handleClick(needsValidation) {
    if (needsValidation && this.conversationService.hasUnsavedChanges) {
      this.confirmationVisible = true;
    } else {
      this.navigateToUseCase();
    }
  }
}
