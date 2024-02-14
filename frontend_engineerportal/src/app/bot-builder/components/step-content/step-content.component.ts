import { Component, Input } from '@angular/core';

@Component({
  selector: 'step-content',
  styleUrls: ['step-content.component.sass'],
  templateUrl: 'step-content.component.html'
})

/**
 * @internal
 * This class is a  component that displays Conversation Manager Coniguration.
 *
 */
export class StepContentComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() description: string;
  @Input() placeholderText: string;
  @Input() avatarImage: string;
  @Input() showBackButton = false;
  @Input() showForm = true;
}
